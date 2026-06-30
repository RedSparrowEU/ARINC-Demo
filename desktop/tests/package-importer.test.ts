import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { calculateSha256 } from '../src/shared/services/checksum-service'
import { importPackageFolder } from '../src/main/services/package-importer'
import { selectAndImportPackage } from '../src/main/services/package-selection-service'

const roots: string[] = []
afterEach(async () => Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true }))))

async function packageFolder(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), 'aeronav-importer-')); roots.push(root)
  await mkdir(join(root, 'navdata')); await writeFile(join(root, 'navdata/demo.txt'), 'generated demo data\n')
  const sha256 = await calculateSha256(join(root, 'navdata/demo.txt'))
  await writeFile(join(root, 'manifest.json'), JSON.stringify({
    packageId: 'ANAV-2607-USA-FD1000', provider: 'Demo', source: 'Generated test data', cycle: '2607',
    region: 'USA', targetDevice: 'FlightDeck FD-1000', formatVersion: '1.0', effectiveFrom: '2026-07-09', effectiveTo: '2026-08-05',
    files: [{ path: 'navdata/demo.txt', category: 'navigation', required: true, sha256 }]
  }))
  return root
}

describe('package importer', () => {
  it('imports a folder, builds a tree, and validates the package', async () => {
    const root = await packageFolder()
    const result = await importPackageFolder(root, new Date('2026-07-10T00:00:00Z'))
    expect(result.kind).toBe('completed')
    if (result.kind === 'completed') {
      expect(result.package.validation.status).toBe('valid')
      expect(result.package.tree.map((node) => node.name)).toEqual(['navdata', 'manifest.json'])
    }
  })

  it('returns a structured missing-manifest failure', async () => {
    const root = await mkdtemp(join(tmpdir(), 'aeronav-empty-')); roots.push(root)
    expect(await importPackageFolder(root)).toMatchObject({ kind: 'failed', issues: [{ code: 'manifest.missing' }] })
  })

  it('preserves cancellation without invoking the importer', async () => {
    const importer = vi.fn()
    const result = await selectAndImportPackage(async () => ({ canceled: true, filePaths: [] }), importer)
    expect(result).toEqual({ kind: 'cancelled' }); expect(importer).not.toHaveBeenCalled()
  })
})

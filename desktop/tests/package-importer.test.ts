import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, join } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { calculateSha256 } from '../src/shared/services/checksum-service'
import { importPackageFolder } from '../src/main/services/package-importer'
import { importPackagePath } from '../src/main/services/package-archive-importer'
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

  it('imports a zip archive, preserves the archive name, and validates the package', async () => {
    const root = await packageFolder()
    const zipPath = await zipPackage(root, 'gps-demo-package')
    const result = await importPackagePath(zipPath, new Date('2026-07-10T00:00:00Z'))

    expect(result.response.kind).toBe('completed')
    expect(result.sourceRoot).toBeDefined()
    expect(result.cleanupRoot).toBeDefined()
    if (result.response.kind === 'completed') {
      expect(result.response.package.rootName).toBe(basename(zipPath, '.zip'))
      expect(result.response.package.validation.status).toBe('valid')
      expect(result.response.package.tree.map((node) => node.name)).toEqual(['navdata', 'manifest.json'])
    }
  })

  it('returns a structured failure when a zip archive has no manifest', async () => {
    const root = await mkdtemp(join(tmpdir(), 'aeronav-zip-empty-')); roots.push(root)
    await writeFile(join(root, 'README.txt'), 'no manifest here\n')
    const zipPath = await zipPackage(root, 'missing-manifest')

    const result = await importPackagePath(zipPath)
    expect(result.response).toMatchObject({
      kind: 'failed',
      message: 'The selected ZIP does not contain manifest.json.'
    })
  })

  it('preserves cancellation without invoking the importer', async () => {
    const importer = vi.fn()
    const result = await selectAndImportPackage(async () => ({ canceled: true, filePaths: [] }), importer)
    expect(result).toEqual({ kind: 'cancelled' }); expect(importer).not.toHaveBeenCalled()
  })
})

async function zipPackage(root: string, archiveBaseName: string): Promise<string> {
  const archivePath = join(tmpdir(), `${archiveBaseName}-${Math.random().toString(36).slice(2)}.zip`)
  roots.push(archivePath)
  const entries = await buildZipEntries(root, root)
  await writeFile(archivePath, buildZip(entries))
  return archivePath
}

async function buildZipEntries(root: string, directory: string): Promise<Array<{ path: string; contents: Buffer }>> {
  const { readdir, readFile } = await import('node:fs/promises')
  const { relative } = await import('node:path')
  const entries = await readdir(directory, { withFileTypes: true })
  const files: Array<{ path: string; contents: Buffer }> = []
  for (const entry of entries) {
    const absolutePath = join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...await buildZipEntries(root, absolutePath))
    } else if (entry.isFile()) {
      files.push({ path: relative(root, absolutePath).split('\\').join('/'), contents: await readFile(absolutePath) })
    }
  }
  return files
}

function buildZip(entries: Array<{ path: string; contents: Buffer }>): Buffer {
  const localParts: Buffer[] = []
  const centralParts: Buffer[] = []
  let offset = 0

  for (const entry of entries.sort((a, b) => a.path.localeCompare(b.path))) {
    const name = Buffer.from(entry.path, 'utf8')
    const crc = crc32(entry.contents)
    const localHeader = Buffer.alloc(30)
    localHeader.writeUInt32LE(0x04034b50, 0)
    localHeader.writeUInt16LE(20, 4)
    localHeader.writeUInt16LE(0x0800, 6)
    localHeader.writeUInt16LE(0, 8)
    localHeader.writeUInt16LE(0, 10)
    localHeader.writeUInt16LE(0, 12)
    localHeader.writeUInt32LE(crc, 14)
    localHeader.writeUInt32LE(entry.contents.length, 18)
    localHeader.writeUInt32LE(entry.contents.length, 22)
    localHeader.writeUInt16LE(name.length, 26)
    localHeader.writeUInt16LE(0, 28)
    localParts.push(localHeader, name, entry.contents)

    const centralHeader = Buffer.alloc(46)
    centralHeader.writeUInt32LE(0x02014b50, 0)
    centralHeader.writeUInt16LE(20, 4)
    centralHeader.writeUInt16LE(20, 6)
    centralHeader.writeUInt16LE(0x0800, 8)
    centralHeader.writeUInt16LE(0, 10)
    centralHeader.writeUInt16LE(0, 12)
    centralHeader.writeUInt16LE(0, 14)
    centralHeader.writeUInt32LE(crc, 16)
    centralHeader.writeUInt32LE(entry.contents.length, 20)
    centralHeader.writeUInt32LE(entry.contents.length, 24)
    centralHeader.writeUInt16LE(name.length, 28)
    centralHeader.writeUInt16LE(0, 30)
    centralHeader.writeUInt16LE(0, 32)
    centralHeader.writeUInt16LE(0, 34)
    centralHeader.writeUInt16LE(0, 36)
    centralHeader.writeUInt32LE(0, 38)
    centralHeader.writeUInt32LE(offset, 42)
    centralParts.push(centralHeader, name)

    offset += localHeader.length + name.length + entry.contents.length
  }

  const central = Buffer.concat(centralParts)
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50, 0)
  end.writeUInt16LE(0, 4)
  end.writeUInt16LE(0, 6)
  end.writeUInt16LE(entries.length, 8)
  end.writeUInt16LE(entries.length, 10)
  end.writeUInt32LE(central.length, 12)
  end.writeUInt32LE(offset, 16)
  end.writeUInt16LE(0, 20)

  return Buffer.concat([...localParts, central, end])
}

function crc32(buffer: Buffer): number {
  let crc = 0xffffffff
  for (const byte of buffer) {
    crc ^= byte
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc & 1) === 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1
    }
  }
  return (crc ^ 0xffffffff) >>> 0
}

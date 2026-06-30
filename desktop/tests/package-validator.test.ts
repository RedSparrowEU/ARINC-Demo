import { mkdtemp, mkdir, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import type { PackageManifest } from '../src/shared/domain/package-manifest'
import { calculateSha256 } from '../src/shared/services/checksum-service'
import { validatePackage } from '../src/shared/services/package-validator'
import { rm } from 'node:fs/promises'

const roots: string[] = []
const now = new Date('2026-07-10T12:00:00Z')

afterEach(async () => Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true }))))

async function fixture(): Promise<{ root: string; manifest: PackageManifest }> {
  const root = await mkdtemp(join(tmpdir(), 'aeronav-validator-')); roots.push(root)
  await mkdir(join(root, 'navdata'))
  await writeFile(join(root, 'navdata/demo.txt'), 'generated demo data\n')
  const sha256 = await calculateSha256(join(root, 'navdata/demo.txt'))
  return {
    root,
    manifest: {
      packageId: 'ANAV-2607-USA-FD1000', provider: 'Demo', source: 'Generated test data', cycle: '2607',
      region: 'USA', targetDevice: 'FlightDeck FD-1000', formatVersion: '1.0',
      effectiveFrom: '2026-07-09', effectiveTo: '2026-08-05',
      files: [{ path: 'navdata/demo.txt', category: 'navigation', required: true, sha256 }]
    }
  }
}

describe('calculateSha256 and validatePackage', () => {
  it('accepts a valid package and exposes its calculated checksum', async () => {
    const { root, manifest } = await fixture()
    const result = await validatePackage(root, manifest, now)
    expect(result.status).toBe('valid')
    expect(result.files[0]).toMatchObject({ exists: true, checksumMatches: true, calculatedSha256: manifest.files[0].sha256 })
  })

  it('fails checksum mismatches', async () => {
    const { root, manifest } = await fixture(); manifest.files[0].sha256 = '0'.repeat(64)
    const result = await validatePackage(root, manifest, now)
    expect(result.status).toBe('failed')
    expect(result.issues).toContainEqual(expect.objectContaining({ code: 'file.checksumMismatch' }))
  })

  it('fails when a required file is missing', async () => {
    const { root, manifest } = await fixture(); manifest.files[0].path = 'navdata/missing.txt'
    expect((await validatePackage(root, manifest, now)).issues).toContainEqual(expect.objectContaining({ code: 'file.missing', severity: 'blocking' }))
  })

  it('warns when an optional file is missing', async () => {
    const { root, manifest } = await fixture(); manifest.files.push({ path: 'charts/optional.pdf', category: 'charts', required: false, sha256: '0'.repeat(64) })
    const result = await validatePackage(root, manifest, now)
    expect(result.status).toBe('warning')
    expect(result.issues).toContainEqual(expect.objectContaining({ code: 'file.missing', severity: 'warning' }))
  })

  it.each(['../outside.txt', '/tmp/outside.txt', 'navdata\\outside.txt', 'navdata/../outside.txt'])(
    'rejects unsafe path %s', async (path) => {
      const { root, manifest } = await fixture(); manifest.files[0].path = path
      expect((await validatePackage(root, manifest, now)).issues).toContainEqual(expect.objectContaining({ code: 'file.unsafePath' }))
    }
  )

  it('rejects declared symbolic links', async () => {
    const { root, manifest } = await fixture()
    await symlink(join(root, 'navdata/demo.txt'), join(root, 'navdata/link.txt'))
    manifest.files[0].path = 'navdata/link.txt'
    expect((await validatePackage(root, manifest, now)).issues).toContainEqual(expect.objectContaining({ code: 'file.symlink' }))
  })

  it('validates naming, date order, expiration, and future effective dates deterministically', async () => {
    const { root, manifest } = await fixture()
    manifest.packageId = 'invalid'; manifest.effectiveFrom = '2020-02-30'; manifest.effectiveTo = '2020-01-01'
    const invalid = await validatePackage(root, manifest, now)
    expect(invalid.issues.map((issue) => issue.code)).toEqual(expect.arrayContaining(['manifest.packageId', 'manifest.effectiveFrom']))

    manifest.packageId = 'ANAV-2607-USA-FD1000'; manifest.effectiveFrom = '2020-01-01'; manifest.effectiveTo = '2020-01-31'
    expect((await validatePackage(root, manifest, now)).issues).toContainEqual(expect.objectContaining({ code: 'manifest.expired' }))

    manifest.effectiveFrom = '2027-01-01'; manifest.effectiveTo = '2027-01-31'
    expect((await validatePackage(root, manifest, now)).status).toBe('warning')
  })
})

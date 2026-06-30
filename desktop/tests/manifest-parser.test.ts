import { describe, expect, it } from 'vitest'
import { ManifestParseError, parseManifest } from '../src/shared/services/manifest-parser'

const manifest = {
  packageId: 'ANAV-2607-USA-FD1000', provider: 'Demo', source: 'Generated test data', cycle: '2607',
  region: 'USA', targetDevice: 'FlightDeck FD-1000', formatVersion: '1.0',
  effectiveFrom: '2026-07-09', effectiveTo: '2026-08-05',
  files: [{ path: 'navdata/demo.txt', category: 'navigation', required: true, sha256: '0'.repeat(64) }]
}

describe('parseManifest', () => {
  it('parses the canonical Phase 1 shape', () => {
    expect(parseManifest(JSON.stringify(manifest))).toEqual(manifest)
  })

  it('rejects invalid JSON', () => {
    expect(() => parseManifest('{')).toThrowError(ManifestParseError)
    try { parseManifest('{') } catch (error) {
      expect((error as ManifestParseError).issues[0].code).toBe('manifest.invalidJson')
    }
  })

  it('reports missing required fields', () => {
    const withoutProvider: Partial<typeof manifest> = { ...manifest }
    delete withoutProvider.provider
    try { parseManifest(JSON.stringify(withoutProvider)) } catch (error) {
      expect((error as ManifestParseError).issues).toContainEqual(expect.objectContaining({ path: 'provider' }))
    }
  })
})

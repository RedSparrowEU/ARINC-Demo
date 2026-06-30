import { describe, expect, it } from 'vitest'
import { encodeCompanionSummary, generateCompanionQr } from '../src/shared/services/companion-bridge'

describe('companion bridge', () => {
  it('encodes the expected compact summary and creates a QR image', async () => {
    const summary = { packageId: 'ANAV-2607-USA-FD1000', status: 'warning', generatedAt: '2026-06-30T00:00:00.000Z', summary: '2 issues', blocking: 0, warning: 2 }
    const payload = encodeCompanionSummary(summary)
    const encoded = payload.slice('AERONAV1:'.length).replaceAll('-', '+').replaceAll('_', '/')
    const padded = encoded + '='.repeat((4 - (encoded.length % 4)) % 4)

    expect(JSON.parse(atob(padded))).toEqual(summary)
    await expect(generateCompanionQr(payload)).resolves.toMatch(/^data:image\/png;base64,/)
  })
})

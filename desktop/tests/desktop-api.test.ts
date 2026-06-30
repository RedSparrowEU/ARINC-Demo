import { describe, expect, it } from 'vitest'
import {
  DESKTOP_BRIDGE_UNAVAILABLE_MESSAGE,
  getOptionalBridge
} from '../src/shared/desktop-bridge'

describe('desktop bridge detection', () => {
  it('returns undefined when the Electron preload bridge is absent', () => {
    expect(getOptionalBridge<{ selectAndImportPackage: () => Promise<unknown> }>({})).toBeUndefined()
  })

  it('keeps a user-facing message for browser-only rendering', () => {
    expect(DESKTOP_BRIDGE_UNAVAILABLE_MESSAGE).toContain('Electron window')
  })
})

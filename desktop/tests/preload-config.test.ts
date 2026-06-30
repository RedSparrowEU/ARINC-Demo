import { describe, expect, it } from 'vitest'
import { sandboxedPreloadOutput } from '../electron.vite.config'

describe('Electron preload configuration', () => {
  it('emits a CommonJS preload script for the sandboxed renderer', () => {
    expect(sandboxedPreloadOutput).toEqual({
      format: 'cjs',
      entryFileNames: '[name].js'
    })
  })
})

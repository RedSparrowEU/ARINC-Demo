import type { AeroNavDesktopApi } from '../../preload'

declare global {
  interface Window {
    aeronav: AeroNavDesktopApi
  }
}

export {}

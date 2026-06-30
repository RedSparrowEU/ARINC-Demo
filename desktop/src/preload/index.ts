import { contextBridge } from 'electron'

export interface AeroNavDesktopApi {
  platform: NodeJS.Platform
}

const api: AeroNavDesktopApi = Object.freeze({
  platform: process.platform
})

contextBridge.exposeInMainWorld('aeronav', api)

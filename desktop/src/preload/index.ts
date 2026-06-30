import { contextBridge, ipcRenderer } from 'electron'
import type { PackageImportResponse } from '../shared/domain/imported-package'

export interface AeroNavDesktopApi {
  platform: NodeJS.Platform
  selectAndImportPackage: () => Promise<PackageImportResponse>
}

const api: AeroNavDesktopApi = Object.freeze({
  platform: process.platform,
  selectAndImportPackage: () => ipcRenderer.invoke('package:select-and-import') as Promise<PackageImportResponse>
})

contextBridge.exposeInMainWorld('aeronav', api)

import { contextBridge, ipcRenderer } from 'electron'
import type { PackageImportResponse } from '../shared/domain/imported-package'
import { deviceProfiles } from '../shared/config/device-profiles'
import type { DeviceProfile } from '../shared/domain/device-profile'
import type { ExportRequest, ExportResult } from '../shared/domain/export-result'

export interface AeroNavDesktopApi {
  platform: NodeJS.Platform
  selectAndImportPackage: () => Promise<PackageImportResponse>
  getDeviceProfiles: () => DeviceProfile[]
  exportPackage: (request:ExportRequest)=>Promise<ExportResult>
}

const api: AeroNavDesktopApi = Object.freeze({
  platform: process.platform,
  selectAndImportPackage: () => ipcRenderer.invoke('package:select-and-import') as Promise<PackageImportResponse>
  ,getDeviceProfiles: () => structuredClone(deviceProfiles)
  ,exportPackage:(request: ExportRequest)=>ipcRenderer.invoke('package:export',request) as Promise<ExportResult>
})

contextBridge.exposeInMainWorld('aeronav', api)

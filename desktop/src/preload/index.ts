import { contextBridge, ipcRenderer } from 'electron'
import type { PackageImportResponse } from '../shared/domain/imported-package'
import { deviceProfiles } from '../shared/config/device-profiles'
import type { DeviceProfile } from '../shared/domain/device-profile'

export interface AeroNavDesktopApi {
  platform: NodeJS.Platform
  selectAndImportPackage: () => Promise<PackageImportResponse>
  getDeviceProfiles: () => DeviceProfile[]
}

const api: AeroNavDesktopApi = Object.freeze({
  platform: process.platform,
  selectAndImportPackage: () => ipcRenderer.invoke('package:select-and-import') as Promise<PackageImportResponse>
  ,getDeviceProfiles: () => structuredClone(deviceProfiles)
})

contextBridge.exposeInMainWorld('aeronav', api)

import { contextBridge, ipcRenderer } from 'electron'
import type { PackageImportResponse } from '../shared/domain/imported-package'
import { deviceProfiles } from '../shared/config/device-profiles'
import type { DeviceProfile } from '../shared/domain/device-profile'
import type { ExportRequest, ExportResult } from '../shared/domain/export-result'
import type{OperationHistoryRecord}from'../shared/domain/diagnostics-report'
import type{PreviewResult,RoutePreview}from'../shared/domain/preview'

export interface AeroNavDesktopApi {
  platform: NodeJS.Platform
  selectAndImportPackage: () => Promise<PackageImportResponse>
  getDeviceProfiles: () => DeviceProfile[]
  exportPackage: (request:ExportRequest)=>Promise<ExportResult>
  saveDiagnostics:(sessionId:string)=>Promise<boolean>;getOperationHistory:()=>Promise<OperationHistoryRecord[]>
  loadRoutePreview:(sessionId:string,path:string)=>Promise<PreviewResult<RoutePreview>>;loadChartPreview:(sessionId:string,path:string)=>Promise<PreviewResult<string>>
}

const api: AeroNavDesktopApi = Object.freeze({
  platform: process.platform,
  selectAndImportPackage: () => ipcRenderer.invoke('package:select-and-import') as Promise<PackageImportResponse>
  ,getDeviceProfiles: () => structuredClone(deviceProfiles)
  ,exportPackage:(request: ExportRequest)=>ipcRenderer.invoke('package:export',request) as Promise<ExportResult>
  ,saveDiagnostics:(sessionId:string)=>ipcRenderer.invoke('diagnostics:save',sessionId) as Promise<boolean>,getOperationHistory:()=>ipcRenderer.invoke('history:list') as Promise<OperationHistoryRecord[]>
  ,loadRoutePreview:(sessionId:string,path:string)=>ipcRenderer.invoke('preview:route',sessionId,path) as Promise<PreviewResult<RoutePreview>>,loadChartPreview:(sessionId:string,path:string)=>ipcRenderer.invoke('preview:chart',sessionId,path) as Promise<PreviewResult<string>>
})

contextBridge.exposeInMainWorld('aeronav', api)

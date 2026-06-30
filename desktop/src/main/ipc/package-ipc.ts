import { dialog, ipcMain } from 'electron'
import { importPackageFolder } from '../services/package-importer'
import { randomUUID } from 'node:crypto'; import { deviceProfiles } from '../../shared/config/device-profiles'; import { exportPackage } from '../services/package-exporter'; import type { ExportRequest } from '../../shared/domain/export-result'
import { access } from 'node:fs/promises'; import { join } from 'node:path'
const sessions=new Map<string,string>()

export const selectPackageChannel = 'package:select-and-import'

export function registerPackageIpc(): void {
  ipcMain.handle(selectPackageChannel, async () => { const selection=await dialog.showOpenDialog({
    title: 'Select AeroNav package folder',
    properties: ['openDirectory', 'createDirectory']
  }); if(selection.canceled)return {kind:'cancelled'}; const result=await importPackageFolder(selection.filePaths[0]); if(result.kind==='completed'){const id=randomUUID();result.package.sessionId=id;sessions.set(id,selection.filePaths[0])} return result })
  ipcMain.handle('package:export',async(_event,request:ExportRequest)=>{const source=sessions.get(request.sessionId);const profile=deviceProfiles.find(p=>p.id===request.profileId);if(!source||!profile)return {kind:'failed',message:'Import session expired.'};const selection=await dialog.showOpenDialog({title:'Select export target',properties:['openDirectory','createDirectory']});if(selection.canceled)return {kind:'cancelled'};const destination=join(selection.filePaths[0],...profile.requiredRootFolder.split('/'));try{await access(destination);const confirmation=await dialog.showMessageBox({type:'warning',buttons:['Cancel','Replace'],defaultId:0,cancelId:0,message:'Replace existing device data?',detail:destination});if(confirmation.response!==1)return {kind:'cancelled'}}catch{/* destination is available */}return exportPackage(source,selection.filePaths[0],profile)})
}

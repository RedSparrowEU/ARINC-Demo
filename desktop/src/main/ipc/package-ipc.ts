import { app, dialog, ipcMain } from 'electron'
import { randomUUID } from 'node:crypto'; import { deviceProfiles } from '../../shared/config/device-profiles'; import { exportPackage } from '../services/package-exporter'; import type { ExportRequest } from '../../shared/domain/export-result'
import { access, rm } from 'node:fs/promises'; import { join } from 'node:path'
import{readFile,writeFile}from'node:fs/promises';import{parseManifest}from'../../shared/services/manifest-parser';import{validatePackage}from'../../shared/services/package-validator';import{buildDiagnostics}from'../../shared/services/diagnostics-builder';import{OperationHistoryStore}from'../services/operation-history-store';import{randomUUID as uuid}from'node:crypto'
import{loadChartPreview,loadRoutePreview}from'../services/preview-service'
import { PackageFolderPreference } from '../services/package-folder-preference'
import { importPackagePath } from '../services/package-archive-importer'
const sessions=new Map<string,{root:string;cleanupRoot?:string}>()

export const selectPackageChannel = 'package:select-and-import'

export function registerPackageIpc(): void {
  const history=new OperationHistoryStore(join(app.getPath('userData'),'operation-history-v1.json'))
  const folderPreference = new PackageFolderPreference(join(app.getPath('userData'), 'package-folder-preference-v1.json'))
  app.once('before-quit',()=>{for(const cleanupRoot of new Set(Array.from(sessions.values()).flatMap(session=>session.cleanupRoot?[session.cleanupRoot]:[]))){void rm(cleanupRoot,{recursive:true,force:true})}})
  ipcMain.handle(selectPackageChannel, async () => { const defaultPath=await folderPreference.loadAccessibleFolder(); const selection=await dialog.showOpenDialog({
    title: 'Select AeroNav package folder or ZIP',
    properties: ['openDirectory', 'openFile', 'createDirectory'],
    filters: [{ name: 'AeroNav Packages', extensions: ['zip'] }],
    ...(defaultPath ? { defaultPath } : {})
  }); if(selection.canceled)return {kind:'cancelled'}; const imported=await importPackagePath(selection.filePaths[0]); const result=imported.response; if(result.kind==='completed'&&imported.sourceRoot){await folderPreference.save(selection.filePaths[0]);const id=randomUUID();result.package.sessionId=id;sessions.set(id,{root:imported.sourceRoot,cleanupRoot:imported.cleanupRoot});void history.append({id:uuid(),attemptedAt:new Date().toISOString(),type:'import',packageId:result.package.manifest.packageId,status:result.package.validation.status,summary:`${result.package.validation.issues.length} issues`})} return result })
  ipcMain.handle('package:export',async(_event,request:ExportRequest)=>{const session=sessions.get(request.sessionId);const profile=deviceProfiles.find(p=>p.id===request.profileId);if(!session||!profile)return {kind:'failed',message:'Import session expired.'};const selection=await dialog.showOpenDialog({title:'Select export target',properties:['openDirectory','createDirectory']});if(selection.canceled)return {kind:'cancelled'};const destination=join(selection.filePaths[0],...profile.requiredRootFolder.split('/'));try{await access(destination);const confirmation=await dialog.showMessageBox({type:'warning',buttons:['Cancel','Replace'],defaultId:0,cancelId:0,message:'Replace existing device data?',detail:destination});if(confirmation.response!==1)return {kind:'cancelled'}}catch{/* destination is available */}const result=await exportPackage(session.root,selection.filePaths[0],profile);if(result.kind==='success')void history.append({id:uuid(),attemptedAt:new Date().toISOString(),type:'export',status:'success',summary:`${result.files.length} files`,logPath:result.logPath});return result})
  ipcMain.handle('diagnostics:save',async(_e,sessionId:string)=>{const session=sessions.get(sessionId);if(!session)return false;const manifest=parseManifest(await readFile(join(session.root,'manifest.json'),'utf8'));const validation=await validatePackage(session.root,manifest);const choice=await dialog.showSaveDialog({defaultPath:'diagnostics-report.json'});if(choice.canceled||!choice.filePath)return false;await writeFile(choice.filePath,JSON.stringify(buildDiagnostics(manifest,validation.issues,validation.status,'validation'),null,2));return true})
  ipcMain.handle('history:list',()=>history.load())
  ipcMain.handle('preview:route',(_e,sessionId:string,path:string)=>{const session=sessions.get(sessionId);return session?loadRoutePreview(session.root,path):{kind:'failed',message:'Import session expired.'}})
  ipcMain.handle('preview:chart',(_e,sessionId:string,path:string)=>{const session=sessions.get(sessionId);return session?loadChartPreview(session.root,path):{kind:'failed',message:'Import session expired.'}})
}

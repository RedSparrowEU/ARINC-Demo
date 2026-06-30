import { dialog, ipcMain } from 'electron'
import { selectAndImportPackage } from '../services/package-selection-service'

export const selectPackageChannel = 'package:select-and-import'

export function registerPackageIpc(): void {
  ipcMain.handle(selectPackageChannel, () => selectAndImportPackage(() => dialog.showOpenDialog({
    title: 'Select AeroNav package folder',
    properties: ['openDirectory', 'createDirectory']
  })))
}

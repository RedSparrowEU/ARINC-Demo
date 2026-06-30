import type { PackageImportResponse } from '../../shared/domain/imported-package'
import { importPackageFolder } from './package-importer'

export interface DirectorySelection {
  canceled: boolean
  filePaths: string[]
}

export type DirectorySelector = () => Promise<DirectorySelection>

export async function selectAndImportPackage(
  selectDirectory: DirectorySelector,
  importer: (path: string) => Promise<PackageImportResponse> = importPackageFolder
): Promise<PackageImportResponse> {
  const selection = await selectDirectory()
  if (selection.canceled || selection.filePaths.length === 0) return { kind: 'cancelled' }
  return importer(selection.filePaths[0])
}

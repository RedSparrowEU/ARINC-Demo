import { mkdtemp, readdir, rm } from 'node:fs/promises'
import { basename, dirname, extname, join } from 'node:path'
import { tmpdir } from 'node:os'
import extractZip from '@electron-internal/extract-zip'
import type { PackageImportResponse } from '../../shared/domain/imported-package'
import { importPackageFolder } from './package-importer'

export interface PackageImportAttempt {
  response: PackageImportResponse
  sourceRoot?: string
  cleanupRoot?: string
}

export async function importPackagePath(selectionPath: string, now: Date = new Date()): Promise<PackageImportAttempt> {
  if (extname(selectionPath).toLowerCase() === '.zip') {
    return importPackageArchive(selectionPath, now)
  }

  return {
    response: await importPackageFolder(selectionPath, now),
    sourceRoot: selectionPath
  }
}

async function importPackageArchive(zipPath: string, now: Date): Promise<PackageImportAttempt> {
  const workspace = await mkdtemp(join(tmpdir(), 'aeronav-archive-'))

  try {
    await extractZip(zipPath, { dir: workspace })
    const packageRoot = await locatePackageRoot(workspace)
    const response = await importPackageFolder(packageRoot, now, basename(zipPath, '.zip'))

    if (response.kind !== 'completed') {
      await rm(workspace, { recursive: true, force: true })
      return { response }
    }

    return {
      response,
      sourceRoot: packageRoot,
      cleanupRoot: workspace
    }
  } catch (error) {
    await rm(workspace, { recursive: true, force: true })
    return {
      response: {
        kind: 'failed',
        message: error instanceof Error ? error.message : 'Package archive import failed unexpectedly.',
        issues: [{ code: 'import.unexpected', severity: 'blocking', message: 'Package archive import failed unexpectedly.' }]
      }
    }
  }
}

async function locatePackageRoot(workspace: string): Promise<string> {
  const manifestPaths = await findManifestPaths(workspace)

  if (manifestPaths.length === 0) {
    throw new Error('The selected ZIP does not contain manifest.json.')
  }
  if (manifestPaths.length > 1) {
    throw new Error('The selected ZIP contains multiple manifest.json files.')
  }

  return dirname(manifestPaths[0])
}

async function findManifestPaths(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  const paths: string[] = []

  for (const entry of entries) {
    const absolutePath = join(directory, entry.name)
    if (entry.isDirectory()) {
      paths.push(...await findManifestPaths(absolutePath))
    } else if (entry.isFile() && entry.name === 'manifest.json') {
      paths.push(absolutePath)
    }
  }

  return paths
}

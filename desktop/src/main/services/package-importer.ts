import { lstat, readFile, readdir } from 'node:fs/promises'
import { basename, join, relative, sep } from 'node:path'
import type { FileTreeNode, PackageImportResponse } from '../../shared/domain/imported-package'
import { ManifestParseError, parseManifest } from '../../shared/services/manifest-parser'
import { validatePackage } from '../../shared/services/package-validator'

export async function importPackageFolder(rootPath: string, now: Date = new Date()): Promise<PackageImportResponse> {
  try {
    const manifestText = await readFile(join(rootPath, 'manifest.json'), 'utf8')
    const manifest = parseManifest(manifestText)
    const [tree, validation] = await Promise.all([
      buildFileTree(rootPath, rootPath),
      validatePackage(rootPath, manifest, now)
    ])
    return {
      kind: 'completed',
      package: { rootName: basename(rootPath), manifest, tree, validation }
    }
  } catch (error) {
    if (error instanceof ManifestParseError) {
      return { kind: 'failed', message: error.message, issues: error.issues }
    }
    if (isMissing(error)) {
      return {
        kind: 'failed',
        message: 'The selected folder does not contain manifest.json.',
        issues: [{ code: 'manifest.missing', severity: 'blocking', message: 'manifest.json was not found.' }]
      }
    }
    return {
      kind: 'failed',
      message: error instanceof Error ? error.message : 'Package import failed unexpectedly.',
      issues: [{ code: 'import.unexpected', severity: 'blocking', message: 'Package import failed unexpectedly.' }]
    }
  }
}

async function buildFileTree(rootPath: string, directory: string): Promise<FileTreeNode[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  const nodes = await Promise.all(entries.map(async (entry): Promise<FileTreeNode> => {
    const absolutePath = join(directory, entry.name)
    const relativePath = relative(rootPath, absolutePath).split(sep).join('/')
    const stats = await lstat(absolutePath)
    if (stats.isSymbolicLink()) return { name: entry.name, relativePath, type: 'symlink' }
    if (stats.isDirectory()) {
      return { name: entry.name, relativePath, type: 'directory', children: await buildFileTree(rootPath, absolutePath) }
    }
    return { name: entry.name, relativePath, type: 'file', size: stats.size }
  }))
  return nodes.sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'directory' ? -1 : 1))
}

function isMissing(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT'
}

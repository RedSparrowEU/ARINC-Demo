import { readFile, stat, writeFile } from 'node:fs/promises'

interface StoredFolderPreference {
  lastPackageFolder: string
}

export class PackageFolderPreference {
  constructor(private readonly filePath: string) {}

  async loadAccessibleFolder(): Promise<string | undefined> {
    try {
      const stored = JSON.parse(await readFile(this.filePath, 'utf8')) as Partial<StoredFolderPreference>
      if (typeof stored.lastPackageFolder !== 'string') return undefined
      const details = await stat(stored.lastPackageFolder)
      return details.isDirectory() ? stored.lastPackageFolder : undefined
    } catch {
      return undefined
    }
  }

  async save(folder: string): Promise<void> {
    await writeFile(this.filePath, JSON.stringify({ lastPackageFolder: folder }, null, 2), 'utf8')
  }
}

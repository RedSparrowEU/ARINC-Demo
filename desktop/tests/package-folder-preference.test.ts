import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { afterEach, describe, expect, it } from 'vitest'
import { PackageFolderPreference } from '../src/main/services/package-folder-preference'

const temporaryDirectories: string[] = []
afterEach(async () => Promise.all(temporaryDirectories.splice(0).map((path) => rm(path, { recursive: true, force: true }))))

async function temporaryDirectory(): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), 'aeronav-folder-preference-'))
  temporaryDirectories.push(directory)
  return directory
}

describe('package folder preference', () => {
  it('round-trips an accessible folder', async () => {
    const directory = await temporaryDirectory()
    const preferencePath = join(directory, 'preference.json')
    const selectedFolder = join(directory, 'package')
    await mkdir(selectedFolder)
    const preference = new PackageFolderPreference(preferencePath)
    await preference.save(selectedFolder)
    expect(await preference.loadAccessibleFolder()).toBe(selectedFolder)
    expect(JSON.parse(await readFile(preferencePath, 'utf8'))).toEqual({ lastPackageFolder: selectedFolder })
  })

  it('ignores corrupt state and inaccessible folders', async () => {
    const directory = await temporaryDirectory()
    const preferencePath = join(directory, 'preference.json')
    const preference = new PackageFolderPreference(preferencePath)
    await writeFile(preferencePath, '{broken', 'utf8')
    expect(await preference.loadAccessibleFolder()).toBeUndefined()
    await writeFile(preferencePath, JSON.stringify({ lastPackageFolder: join(directory, 'missing') }), 'utf8')
    expect(await preference.loadAccessibleFolder()).toBeUndefined()
  })
})

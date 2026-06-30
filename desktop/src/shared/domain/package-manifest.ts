export interface ManifestFile {
  path: string
  category: string
  required: boolean
  sha256: string
}

export interface PackageManifest {
  packageId: string
  provider: string
  source: string
  cycle: string
  region: string
  targetDevice: string
  formatVersion: string
  generatedAt?: string
  effectiveFrom: string
  effectiveTo: string
  requiresSigning?: boolean
  signed?: boolean
  dataCategories?: string[]
  files: ManifestFile[]
}

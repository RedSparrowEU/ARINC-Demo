import type { PackageManifest } from './package-manifest'
import type { ValidationIssue, ValidationResult } from './validation-result'

export type FileTreeNodeType = 'directory' | 'file' | 'symlink'

export interface FileTreeNode {
  name: string
  relativePath: string
  type: FileTreeNodeType
  size?: number
  children?: FileTreeNode[]
}

export interface ImportedPackage {
  rootName: string
  manifest: PackageManifest
  tree: FileTreeNode[]
  validation: ValidationResult
}

export type PackageImportResponse =
  | { kind: 'cancelled' }
  | { kind: 'completed'; package: ImportedPackage }
  | { kind: 'failed'; message: string; issues: ValidationIssue[] }

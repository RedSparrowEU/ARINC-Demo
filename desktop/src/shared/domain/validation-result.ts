export type ValidationStatus = 'valid' | 'warning' | 'failed'
export type ValidationSeverity = 'info' | 'warning' | 'error' | 'blocking'

export interface ValidationIssue {
  code: string
  severity: ValidationSeverity
  message: string
  path?: string
}

export interface FileValidationResult {
  path: string
  category: string
  required: boolean
  expectedSha256: string
  calculatedSha256?: string
  exists: boolean
  checksumMatches?: boolean
}

export interface ValidationResult {
  status: ValidationStatus
  issues: ValidationIssue[]
  files: FileValidationResult[]
}

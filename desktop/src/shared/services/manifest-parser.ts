import type { ManifestFile, PackageManifest } from '../domain/package-manifest'
import type { ValidationIssue } from '../domain/validation-result'

export class ManifestParseError extends Error {
  constructor(public readonly issues: ValidationIssue[]) {
    super(issues[0]?.message ?? 'Manifest is invalid')
    this.name = 'ManifestParseError'
  }
}

const requiredStrings = [
  'packageId',
  'provider',
  'source',
  'cycle',
  'region',
  'targetDevice',
  'formatVersion',
  'effectiveFrom',
  'effectiveTo'
] as const

export function parseManifest(text: string): PackageManifest {
  let value: unknown
  try {
    value = JSON.parse(text)
  } catch {
    throw new ManifestParseError([
      { code: 'manifest.invalidJson', severity: 'blocking', message: 'manifest.json is not valid JSON.' }
    ])
  }

  if (!isRecord(value)) {
    throw new ManifestParseError([
      { code: 'manifest.invalidRoot', severity: 'blocking', message: 'Manifest root must be an object.' }
    ])
  }

  const issues: ValidationIssue[] = []
  for (const field of requiredStrings) {
    if (typeof value[field] !== 'string' || value[field].trim() === '') {
      issues.push({
        code: 'manifest.requiredField',
        severity: 'blocking',
        message: `Required field "${field}" must be a non-empty string.`,
        path: field
      })
    }
  }

  if (!Array.isArray(value.files)) {
    issues.push({
      code: 'manifest.requiredField',
      severity: 'blocking',
      message: 'Required field "files" must be an array.',
      path: 'files'
    })
  }

  const files = Array.isArray(value.files)
    ? value.files.flatMap((file, index) => parseFile(file, index, issues))
    : []

  validateOptionalString(value, 'generatedAt', issues)
  validateOptionalBoolean(value, 'requiresSigning', issues)
  validateOptionalBoolean(value, 'signed', issues)
  if (value.dataCategories !== undefined &&
      (!Array.isArray(value.dataCategories) || value.dataCategories.some((item) => typeof item !== 'string'))) {
    issues.push({
      code: 'manifest.invalidField',
      severity: 'blocking',
      message: 'Optional field "dataCategories" must be an array of strings.',
      path: 'dataCategories'
    })
  }

  if (issues.length > 0) throw new ManifestParseError(issues)

  return {
    packageId: value.packageId as string,
    provider: value.provider as string,
    source: value.source as string,
    cycle: value.cycle as string,
    region: value.region as string,
    targetDevice: value.targetDevice as string,
    formatVersion: value.formatVersion as string,
    effectiveFrom: value.effectiveFrom as string,
    effectiveTo: value.effectiveTo as string,
    files,
    ...(typeof value.generatedAt === 'string' ? { generatedAt: value.generatedAt } : {}),
    ...(typeof value.requiresSigning === 'boolean' ? { requiresSigning: value.requiresSigning } : {}),
    ...(typeof value.signed === 'boolean' ? { signed: value.signed } : {}),
    ...(Array.isArray(value.dataCategories) ? { dataCategories: value.dataCategories as string[] } : {})
  }
}

function parseFile(value: unknown, index: number, issues: ValidationIssue[]): ManifestFile[] {
  if (!isRecord(value)) {
    issues.push({
      code: 'manifest.invalidFile',
      severity: 'blocking',
      message: `File entry ${index} must be an object.`,
      path: `files[${index}]`
    })
    return []
  }

  const fields: Array<[keyof ManifestFile, 'string' | 'boolean']> = [
    ['path', 'string'], ['category', 'string'], ['required', 'boolean'], ['sha256', 'string']
  ]
  let valid = true
  for (const [field, type] of fields) {
    if (typeof value[field] !== type || (type === 'string' && (value[field] as string).trim() === '')) {
      valid = false
      issues.push({
        code: 'manifest.invalidFileField',
        severity: 'blocking',
        message: `File entry ${index} field "${field}" must be a ${type}.`,
        path: `files[${index}].${field}`
      })
    }
  }
  return valid ? [value as unknown as ManifestFile] : []
}

function validateOptionalString(value: Record<string, unknown>, key: string, issues: ValidationIssue[]): void {
  if (value[key] !== undefined && typeof value[key] !== 'string') {
    issues.push({ code: 'manifest.invalidField', severity: 'blocking', message: `Optional field "${key}" must be a string.`, path: key })
  }
}

function validateOptionalBoolean(value: Record<string, unknown>, key: string, issues: ValidationIssue[]): void {
  if (value[key] !== undefined && typeof value[key] !== 'boolean') {
    issues.push({ code: 'manifest.invalidField', severity: 'blocking', message: `Optional field "${key}" must be a boolean.`, path: key })
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

import { lstat, realpath } from 'node:fs/promises'
import { isAbsolute, relative, resolve, sep } from 'node:path'
import type { PackageManifest } from '../domain/package-manifest'
import type { FileValidationResult, ValidationIssue, ValidationResult } from '../domain/validation-result'
import { calculateSha256 } from './checksum-service'

export async function validatePackage(
  rootPath: string,
  manifest: PackageManifest,
  now: Date = new Date()
): Promise<ValidationResult> {
  const issues: ValidationIssue[] = []
  validateMetadata(manifest, now, issues)
  const files: FileValidationResult[] = []
  const canonicalRoot = await realpath(rootPath)

  for (const file of manifest.files) {
    const result: FileValidationResult = {
      path: file.path,
      category: file.category,
      required: file.required,
      expectedSha256: file.sha256.toLowerCase(),
      exists: false
    }
    files.push(result)

    if (!isSafePackagePath(file.path)) {
      issues.push({ code: 'file.unsafePath', severity: 'blocking', message: 'Declared file path is unsafe.', path: file.path })
      continue
    }

    const absolutePath = resolve(canonicalRoot, ...file.path.split('/'))
    if (!isInside(canonicalRoot, absolutePath)) {
      issues.push({ code: 'file.pathEscape', severity: 'blocking', message: 'Declared file resolves outside the package root.', path: file.path })
      continue
    }

    let stats
    try {
      stats = await lstat(absolutePath)
    } catch (error) {
      if (isMissing(error)) {
        issues.push({
          code: 'file.missing',
          severity: file.required ? 'blocking' : 'warning',
          message: `${file.required ? 'Required' : 'Optional'} file is missing.`,
          path: file.path
        })
        continue
      }
      throw error
    }

    result.exists = true
    if (stats.isSymbolicLink()) {
      issues.push({ code: 'file.symlink', severity: 'blocking', message: 'Symbolic links are not allowed in declared package files.', path: file.path })
      continue
    }
    if (!stats.isFile()) {
      issues.push({ code: 'file.notRegular', severity: 'blocking', message: 'Declared path is not a regular file.', path: file.path })
      continue
    }

    const canonicalFile = await realpath(absolutePath)
    if (!isInside(canonicalRoot, canonicalFile)) {
      issues.push({ code: 'file.realPathEscape', severity: 'blocking', message: 'Declared file resolves outside the package root.', path: file.path })
      continue
    }

    result.calculatedSha256 = await calculateSha256(canonicalFile)
    result.checksumMatches = result.calculatedSha256 === result.expectedSha256
    if (!result.checksumMatches) {
      issues.push({ code: 'file.checksumMismatch', severity: 'blocking', message: 'SHA-256 checksum does not match the manifest.', path: file.path })
    }
  }

  return { status: statusFor(issues), issues, files }
}

function validateMetadata(manifest: PackageManifest, now: Date, issues: ValidationIssue[]): void {
  const idMatch = /^ANAV-(\d{4})-([A-Z]{2,8})-([A-Z0-9]+)$/.exec(manifest.packageId)
  if (!idMatch) {
    issues.push({ code: 'manifest.packageId', severity: 'blocking', message: 'Package ID must match ANAV-<cycle>-<region>-<device code>.', path: 'packageId' })
  }
  if (!/^\d{4}$/.test(manifest.cycle)) {
    issues.push({ code: 'manifest.cycle', severity: 'blocking', message: 'Cycle must contain four digits.', path: 'cycle' })
  } else if (idMatch?.[1] !== manifest.cycle) {
    issues.push({ code: 'manifest.cycleMismatch', severity: 'blocking', message: 'Package ID cycle does not match the cycle field.', path: 'cycle' })
  }
  if (idMatch && idMatch[2] !== manifest.region) {
    issues.push({ code: 'manifest.regionMismatch', severity: 'blocking', message: 'Package ID region does not match the region field.', path: 'region' })
  }
  for (const file of manifest.files) {
    if (!/^[a-fA-F0-9]{64}$/.test(file.sha256)) {
      issues.push({ code: 'file.invalidChecksum', severity: 'blocking', message: 'Declared SHA-256 must contain 64 hexadecimal characters.', path: file.path })
    }
  }

  const from = parseIsoDate(manifest.effectiveFrom)
  const to = parseIsoDate(manifest.effectiveTo)
  if (!from) issues.push({ code: 'manifest.effectiveFrom', severity: 'blocking', message: 'effectiveFrom must be a valid YYYY-MM-DD date.', path: 'effectiveFrom' })
  if (!to) issues.push({ code: 'manifest.effectiveTo', severity: 'blocking', message: 'effectiveTo must be a valid YYYY-MM-DD date.', path: 'effectiveTo' })
  if (!from || !to) return
  if (to < from) {
    issues.push({ code: 'manifest.dateOrder', severity: 'blocking', message: 'effectiveTo must not be before effectiveFrom.', path: 'effectiveTo' })
    return
  }
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  if (to.getTime() < today) {
    issues.push({ code: 'manifest.expired', severity: 'blocking', message: 'Package effective period has expired.', path: 'effectiveTo' })
  } else if (from.getTime() > today) {
    issues.push({ code: 'manifest.notEffective', severity: 'warning', message: 'Package is not effective yet.', path: 'effectiveFrom' })
  }
}

function parseIsoDate(value: string): Date | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return undefined
  const year = Number(match[1]); const month = Number(match[2]); const day = Number(match[3])
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? date : undefined
}

function isSafePackagePath(value: string): boolean {
  if (!value || value.includes('\0') || value.includes('\\') || isAbsolute(value) || value.startsWith('/')) return false
  const segments = value.split('/')
  return segments.every((segment) => segment !== '' && segment !== '.' && segment !== '..')
}

function isInside(root: string, candidate: string): boolean {
  const offset = relative(root, candidate)
  return offset === '' || (!offset.startsWith(`..${sep}`) && offset !== '..' && !isAbsolute(offset))
}

function statusFor(issues: ValidationIssue[]): ValidationResult['status'] {
  if (issues.some((issue) => issue.severity === 'error' || issue.severity === 'blocking')) return 'failed'
  if (issues.some((issue) => issue.severity === 'warning')) return 'warning'
  return 'valid'
}

function isMissing(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT'
}

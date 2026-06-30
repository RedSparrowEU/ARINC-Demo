import type { ValidationIssue, ValidationStatus } from './validation-result'
export type MediaType = 'SD_CARD' | 'USB_DRIVE'
export interface DeviceProfile { id:string; name:string; mediaType:MediaType; requiredRootFolder:string; supportedRegions:string[]; requiredCategories:string[]; optionalCategories:string[]; requiresSignedPackages:boolean; maxPackageSizeMb:number }
export interface DeviceCompatibilityResult { status:ValidationStatus; issues:ValidationIssue[] }

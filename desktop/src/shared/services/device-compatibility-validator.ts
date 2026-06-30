import type { DeviceProfile, DeviceCompatibilityResult } from '../domain/device-profile'
import type { PackageManifest } from '../domain/package-manifest'
import type { ValidationIssue } from '../domain/validation-result'
export function validateDeviceCompatibility(manifest:PackageManifest, profile:DeviceProfile|undefined, sizeBytes:number):DeviceCompatibilityResult {
 const issues:ValidationIssue[]=[]
 if(!profile) issues.push({code:'device.unknown',severity:'blocking',message:'Select a known target device.'})
 else {
  if(profile.name!==manifest.targetDevice) issues.push({code:'device.mismatch',severity:'blocking',message:`Package targets ${manifest.targetDevice}; selected device is ${profile.name}.`})
  if(!profile.supportedRegions.includes(manifest.region)) issues.push({code:'device.region',severity:'blocking',message:`Region ${manifest.region} is not supported.`})
  const cats=new Set(manifest.files.map(f=>f.category)); for(const c of profile.requiredCategories) if(!cats.has(c)) issues.push({code:'device.requiredCategory',severity:'blocking',message:`Required category ${c} is missing.`})
  for(const c of cats) if(![...profile.requiredCategories,...profile.optionalCategories].includes(c)) issues.push({code:'device.unsupportedCategory',severity:'blocking',message:`Category ${c} is unsupported.`})
  if(!manifest.mediaType) issues.push({code:'device.mediaUnknown',severity:'warning',message:'Manifest does not declare mediaType.'}); else if(manifest.mediaType!==profile.mediaType) issues.push({code:'device.mediaMismatch',severity:'blocking',message:`Package media ${manifest.mediaType} does not match ${profile.mediaType}.`})
  if(profile.requiresSignedPackages && manifest.signed!==true) issues.push({code:'device.signature',severity:'blocking',message:'Selected device requires a signed package.'})
  if(sizeBytes>profile.maxPackageSizeMb*1024*1024) issues.push({code:'device.size',severity:'blocking',message:'Package exceeds the device size limit.'})
 }
 return {status:issues.some(i=>i.severity==='blocking'||i.severity==='error')?'failed':issues.length?'warning':'valid',issues}
}
export function matchingDeviceProfile(manifest:PackageManifest, profiles:DeviceProfile[]):DeviceProfile|undefined { return profiles.find(p=>p.name===manifest.targetDevice) }

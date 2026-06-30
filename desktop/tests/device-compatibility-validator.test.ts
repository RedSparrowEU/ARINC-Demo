import { describe,expect,it } from 'vitest'
import { deviceProfiles } from '../src/shared/config/device-profiles'
import type { PackageManifest } from '../src/shared/domain/package-manifest'
import { matchingDeviceProfile,validateDeviceCompatibility } from '../src/shared/services/device-compatibility-validator'
const manifest:PackageManifest={packageId:'ANAV-2607-USA-FD1000',provider:'Demo',source:'Generated',cycle:'2607',region:'USA',targetDevice:'FlightDeck FD-1000',formatVersion:'1.0',mediaType:'SD_CARD',effectiveFrom:'2026-06-30',effectiveTo:'2026-08-05',signed:true,files:[{path:'navdata/demo',category:'navigation',required:true,sha256:'0'.repeat(64)}]}
describe('device compatibility',()=>{
 it('matches and validates a compatible profile',()=>{const p=matchingDeviceProfile(manifest,deviceProfiles);expect(p?.id).toBe('FD1000');expect(validateDeviceCompatibility(manifest,p,10).status).toBe('valid')})
 it('reports unknown profiles',()=>expect(validateDeviceCompatibility(manifest,undefined,0).status).toBe('failed'))
 it('reports region, category, media, signing, and size failures',()=>{const m={...manifest,targetDevice:'FlightDeck FD-2000',region:'EUR',mediaType:'SD_CARD' as const,signed:false};const r=validateDeviceCompatibility(m,deviceProfiles[1],9_000*1024*1024);expect(r.issues.map(i=>i.code)).toEqual(expect.arrayContaining(['device.region','device.requiredCategory','device.mediaMismatch','device.signature','device.size']))})
 it('warns for missing media',()=>expect(validateDeviceCompatibility({...manifest,mediaType:undefined},deviceProfiles[0],0).status).toBe('warning'))
})

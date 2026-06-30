import type { DeviceProfile } from '../domain/device-profile'
export const deviceProfiles: DeviceProfile[] = [
  { id:'FD1000', name:'FlightDeck FD-1000', mediaType:'SD_CARD', requiredRootFolder:'AVIONICS/NAVDATA', supportedRegions:['USA','EUR'], requiredCategories:['navigation'], optionalCategories:['charts','terrain','obstacles'], requiresSignedPackages:false, maxPackageSizeMb:4096 },
  { id:'FD2000', name:'FlightDeck FD-2000', mediaType:'USB_DRIVE', requiredRootFolder:'FLIGHTDECK/DATA', supportedRegions:['USA'], requiredCategories:['navigation','charts'], optionalCategories:['terrain'], requiresSignedPackages:true, maxPackageSizeMb:8192 }
  ,{ id:'SEC1000', name:'FlightDeck Secure-1000', mediaType:'SD_CARD', requiredRootFolder:'SECURE/NAVDATA', supportedRegions:['USA'], requiredCategories:['navigation'], optionalCategories:[], requiresSignedPackages:true, maxPackageSizeMb:4096 }
]

export const DESKTOP_BRIDGE_UNAVAILABLE_MESSAGE =
  'Desktop bridge unavailable. Open the app in the Electron window, not a regular browser tab.'

export function getOptionalBridge<T>(target: { aeronav?: T }): T | undefined {
  return target.aeronav
}

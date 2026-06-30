import QRCode from 'qrcode'

export interface CompanionSummary {
  packageId: string
  status: string
  generatedAt: string
  summary: string
  blocking: number
  warning: number
}

export function encodeCompanionSummary(summary: CompanionSummary): string {
  const encoded = btoa(JSON.stringify(summary))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '')
  return `AERONAV1:${encoded}`
}

export function generateCompanionQr(payload: string): Promise<string> {
  return QRCode.toDataURL(payload, { errorCorrectionLevel: 'M', margin: 2, width: 320 })
}

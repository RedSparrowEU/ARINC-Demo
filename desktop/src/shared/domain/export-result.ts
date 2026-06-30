export interface ExportRequest { sessionId:string; profileId:string }
export interface ExportFileResult { path:string; status:'copied'|'skipped'; expectedSha256?:string; exportedSha256?:string }
export interface ExportLog { schemaVersion:1; packageId:string; profileId:string; exportedAt:string; files:ExportFileResult[] }
export type ExportResult = {kind:'cancelled'}|{kind:'success';destination:string;logPath:string;files:ExportFileResult[]}|{kind:'failed';message:string}

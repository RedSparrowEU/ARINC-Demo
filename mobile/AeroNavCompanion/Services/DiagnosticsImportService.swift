import Foundation

struct DiagnosticsReport: Codable, Equatable, Sendable {
    struct AppInfo: Codable, Equatable, Sendable {
        let name, version, platform: String
    }
    struct Operation: Codable, Equatable, Sendable { let type, status: String }
    struct PackageInfo: Codable, Equatable, Sendable {
        let packageId, cycle, region, targetDevice: String
    }
    struct Summary: Codable, Equatable, Sendable {
        let info, warning, error, blocking, total: Int
    }
    struct Issue: Codable, Identifiable, Equatable, Sendable {
        var id: String { "\(code)-\(path ?? "")" }
        let code, severity, message: String
        let path: String?
        let suggestedAction: String
    }
    let schemaVersion: Int
    let reportId, generatedAt: String
    let application: AppInfo
    let operation: Operation
    let package: PackageInfo
    let summary: Summary
    let issues: [Issue]
}
protocol DiagnosticsImporting: Sendable {
    func load(from: URL) async throws -> DiagnosticsReport
}
struct DiagnosticsImportService: DiagnosticsImporting {
    let loader: any ManifestLoading
    init(loader: any ManifestLoading = LocalManifestLoader()) {
        self.loader = loader
    }
    func load(from url: URL) async throws -> DiagnosticsReport {
        guard url.pathExtension.lowercased() == "json" else {
            throw ManifestImportError.invalidType
        }
        let report = try JSONDecoder().decode(
            DiagnosticsReport.self,
            from: await loader.loadManifest(from: url)
        )
        guard report.schemaVersion == 1 else {
            throw CocoaError(.fileReadCorruptFile)
        }
        return report
    }
}

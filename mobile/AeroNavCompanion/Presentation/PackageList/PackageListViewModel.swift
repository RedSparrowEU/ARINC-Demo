import Foundation

@MainActor
final class PackageListViewModel: ObservableObject {
    enum ImportState {
        case idle, loading
        case result(ManifestImportOutcome)
        case failure(String)
    }
    @Published private(set) var packages: [NavigationPackage]
    @Published private(set) var importState: ImportState = .idle
    private let importer: any ManifestImporting
    let historyStore: any ValidationHistoryStoring

    init(
        packages: [NavigationPackage] = SamplePackages.all,
        importer: any ManifestImporting = ManifestImportService(),
        historyStore: any ValidationHistoryStoring =
            JSONValidationHistoryStore()
    ) {
        self.packages = packages
        self.importer = importer
        self.historyStore = historyStore
    }
    func importManifest(from url: URL) async {
        importState = .loading
        let now = Date()
        do {
            let result = try await importer.importManifest(from: url, now: now)
            if let package = result.package {
                packages.removeAll { $0.id == package.id }
                packages.insert(package, at: 0)
            }
            importState = .result(result)
            try? await historyStore.append(
                .init(
                    id: UUID(),
                    attemptedAt: now,
                    fileName: url.lastPathComponent,
                    packageId: result.package?.id,
                    status: result.status?.rawValue ?? "Failed",
                    issues: result.issues.map(\.message)
                )
            )
        } catch {
            importState = .failure(error.localizedDescription)
            try? await historyStore.append(
                .init(
                    id: UUID(),
                    attemptedAt: now,
                    fileName: url.lastPathComponent,
                    packageId: nil,
                    status: "Failed",
                    issues: [error.localizedDescription]
                )
            )
        }
    }
}

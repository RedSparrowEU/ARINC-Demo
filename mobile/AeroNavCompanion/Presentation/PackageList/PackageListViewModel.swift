import Foundation

@MainActor
final class PackageListViewModel: ObservableObject {
    enum ImportState { case idle, loading, result(ManifestImportOutcome), failure(String) }
    @Published private(set) var packages: [NavigationPackage]
    @Published private(set) var importState: ImportState = .idle
    private let importer:any ManifestImporting

    init(packages: [NavigationPackage] = SamplePackages.all, importer:any ManifestImporting = ManifestImportService()) {
        self.packages = packages
        self.importer = importer
    }
    func importManifest(from url:URL) async { importState = .loading; do { let result=try await importer.importManifest(from:url,now:Date()); if let package=result.package { packages.removeAll{$0.id==package.id}; packages.insert(package,at:0) }; importState = .result(result) } catch { importState = .failure(error.localizedDescription) } }
}

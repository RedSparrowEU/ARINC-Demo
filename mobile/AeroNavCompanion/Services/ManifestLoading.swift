import Foundation

protocol ManifestLoading: Sendable {
    func loadManifest(from url: URL) async throws -> Data
}

struct LocalManifestLoader: ManifestLoading {
    func loadManifest(from url: URL) async throws -> Data {
        let scoped = url.startAccessingSecurityScopedResource()
        defer { if scoped { url.stopAccessingSecurityScopedResource() } }
        return try await Task.detached(priority: .userInitiated) {
            try Data(contentsOf: url)
        }.value
    }
}

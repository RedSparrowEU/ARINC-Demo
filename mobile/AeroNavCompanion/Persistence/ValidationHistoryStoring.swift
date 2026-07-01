import Foundation

struct ValidationHistoryRecord: Codable, Identifiable, Equatable, Sendable {
    let id: UUID
    let attemptedAt: Date
    let fileName: String
    let packageId: String?
    let status: String
    let issues: [String]
}
protocol ValidationHistoryStoring: Sendable {
    func load() async throws -> [ValidationHistoryRecord]
    func append(_ record: ValidationHistoryRecord) async throws
}
actor JSONValidationHistoryStore: ValidationHistoryStoring {
    struct Envelope: Codable {
        let schemaVersion: Int
        var entries: [ValidationHistoryRecord]
    }
    let url: URL
    init(
        url: URL = FileManager.default.urls(
            for: .applicationSupportDirectory,
            in: .userDomainMask
        )[0].appending(path: "AeroNavCompanion/validation-history-v1.json")
    ) { self.url = url }
    func load() throws -> [ValidationHistoryRecord] {
        guard FileManager.default.fileExists(atPath: url.path) else {
            return []
        }
        let envelope = try JSONDecoder.iso.decode(
            Envelope.self,
            from: Data(contentsOf: url)
        )
        guard envelope.schemaVersion == 1 else {
            throw CocoaError(.fileReadCorruptFile)
        }
        return envelope.entries.sorted { $0.attemptedAt > $1.attemptedAt }
    }
    func append(_ record: ValidationHistoryRecord) throws {
        var entries = (try? load()) ?? []
        entries.insert(record, at: 0)
        entries = Array(entries.prefix(100))
        try FileManager.default.createDirectory(
            at: url.deletingLastPathComponent(),
            withIntermediateDirectories: true
        )
        try JSONEncoder.iso.encode(Envelope(schemaVersion: 1, entries: entries))
            .write(to: url, options: .atomic)
    }
}
extension JSONDecoder {
    fileprivate static var iso: JSONDecoder {
        let d = JSONDecoder()
        d.dateDecodingStrategy = .iso8601
        return d
    }
}
extension JSONEncoder {
    fileprivate static var iso: JSONEncoder {
        let e = JSONEncoder()
        e.dateEncodingStrategy = .iso8601
        return e
    }
}

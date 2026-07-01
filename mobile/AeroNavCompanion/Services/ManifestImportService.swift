import Foundation

struct MobileValidationIssue: Identifiable, Equatable, Sendable {
    let id: String
    let message: String
}
struct ManifestImportOutcome: Equatable, Sendable {
    let package: NavigationPackage?
    let issues: [MobileValidationIssue]
    let status: PackageStatus?
}
enum ManifestImportError: LocalizedError {
    case invalidType, tooLarge, unreadable
    var errorDescription: String? {
        switch self {
        case .invalidType: "Select a JSON file."
        case .tooLarge: "Manifest exceeds 1 MB."
        case .unreadable: "Manifest could not be read."
        }
    }
}

struct ManifestDTO: Decodable {
    let packageId, provider, source, cycle, region, targetDevice, formatVersion,
        effectiveFrom, effectiveTo: String
    let mediaType: String?
    let files: [FileDTO]
    struct FileDTO: Decodable {
        let path, category, sha256: String
        let required: Bool
    }
}

protocol ManifestImporting: Sendable {
    func importManifest(from url: URL, now: Date) async throws
        -> ManifestImportOutcome
}
struct ManifestImportService: ManifestImporting {
    let loader: any ManifestLoading
    init(loader: any ManifestLoading = LocalManifestLoader()) {
        self.loader = loader
    }
    func importManifest(from url: URL, now: Date = Date()) async throws
        -> ManifestImportOutcome
    {
        guard url.pathExtension.lowercased() == "json" else {
            throw ManifestImportError.invalidType
        }
        if (try? url.resourceValues(forKeys: [.fileSizeKey]).fileSize).map({
            $0 > 1_048_576
        }) == true {
            throw ManifestImportError.tooLarge
        }
        let data = try await loader.loadManifest(from: url)
        let dto: ManifestDTO
        do {
            dto = try JSONDecoder().decode(ManifestDTO.self, from: data)
        } catch {
            return .init(
                package: nil,
                issues: [
                    .init(
                        id: "manifest.decode",
                        message: "Invalid JSON or missing required fields."
                    )
                ],
                status: nil
            )
        }
        var issues: [MobileValidationIssue] = []
        let parts = dto.packageId.split(separator: "-")
        if parts.count != 4 || parts[0] != "ANAV"
            || parts[1] != Substring(dto.cycle)
            || parts[2] != Substring(dto.region)
            || dto.cycle.range(of: "^[0-9]{4}$", options: .regularExpression)
                == nil
        {
            issues.append(
                .init(
                    id: "manifest.identity",
                    message: "Package ID, cycle, and region are inconsistent."
                )
            )
        }
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.timeZone = TimeZone(secondsFromGMT: 0)
        formatter.dateFormat = "yyyy-MM-dd"
        guard let from = formatter.date(from: dto.effectiveFrom),
            let to = formatter.date(from: dto.effectiveTo)
        else {
            return .init(
                package: nil,
                issues: [
                    .init(
                        id: "manifest.dates",
                        message:
                            "Effective dates must use valid YYYY-MM-DD values."
                    )
                ],
                status: nil
            )
        }
        if to < from {
            issues.append(
                .init(
                    id: "manifest.dateOrder",
                    message: "Effective end date precedes start date."
                )
            )
        } else if to < Calendar.current.startOfDay(for: now) {
            issues.append(
                .init(id: "manifest.expired", message: "Package is expired.")
            )
        } else if from > now {
            issues.append(
                .init(
                    id: "manifest.future",
                    message: "Package is not effective yet."
                )
            )
        }
        for file in dto.files {
            if file.path.isEmpty || file.path.hasPrefix("/")
                || file.path.contains("..") || file.path.contains("\\")
            {
                issues.append(
                    .init(
                        id: "file.path.\(file.path)",
                        message: "Unsafe declared path: \(file.path)"
                    )
                )
            }
            if file.sha256.range(
                of: "^[0-9a-fA-F]{64}$",
                options: .regularExpression
            ) == nil {
                issues.append(
                    .init(
                        id: "file.hash.\(file.path)",
                        message: "Invalid SHA-256 for \(file.path)"
                    )
                )
            }
        }
        let failed = issues.contains { $0.id != "manifest.future" }
        let status: PackageStatus =
            failed ? .failed : issues.isEmpty ? .valid : .warning
        let package = NavigationPackage(
            id: dto.packageId,
            provider: dto.provider,
            source: dto.source,
            cycle: dto.cycle,
            region: dto.region,
            targetDevice: dto.targetDevice,
            effectiveFrom: from,
            effectiveTo: to,
            status: status,
            files: dto.files.map {
                .init(
                    path: $0.path,
                    category: $0.category,
                    required: $0.required
                )
            }
        )
        return .init(package: package, issues: issues, status: status)
    }
}

import Foundation

struct NavigationPackage: Identifiable, Equatable, Sendable {
    let id: String
    let provider: String
    let source: String
    let cycle: String
    let region: String
    let targetDevice: String
    let effectiveFrom: Date
    let effectiveTo: Date
    let status: PackageStatus
    let files: [PackageFileDisplay]
}

enum PackageStatus: String, CaseIterable, Equatable, Sendable {
    case valid = "Valid"
    case warning = "Warning"
    case failed = "Failed"
}

struct PackageFileDisplay: Identifiable, Equatable, Sendable {
    var id: String { path }
    let path: String
    let category: String
    let required: Bool
}

struct PackageCategoryGroup: Identifiable, Equatable, Sendable {
    var id: String { category }
    let category: String
    let files: [PackageFileDisplay]
}

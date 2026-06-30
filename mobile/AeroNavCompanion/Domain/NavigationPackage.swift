import Foundation

struct NavigationPackage: Identifiable, Equatable, Sendable {
    let id: String
    let cycle: String
    let region: String
    let status: PackageStatus
}

enum PackageStatus: String, Equatable, Sendable {
    case sample = "Sample only"
}

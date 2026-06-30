import Foundation

@MainActor
final class PackageDetailsViewModel: ObservableObject {
    let package: NavigationPackage
    let categoryGroups: [PackageCategoryGroup]

    init(package: NavigationPackage) {
        self.package = package
        categoryGroups = Dictionary(grouping: package.files, by: \PackageFileDisplay.category)
            .map { PackageCategoryGroup(category: $0.key, files: $0.value.sorted { $0.path < $1.path }) }
            .sorted { $0.category < $1.category }
    }

    var effectivePeriod: String {
        "\(Self.dateFormatter.string(from: package.effectiveFrom)) – \(Self.dateFormatter.string(from: package.effectiveTo))"
    }

    private static let dateFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.timeZone = TimeZone(secondsFromGMT: 0)
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter
    }()
}

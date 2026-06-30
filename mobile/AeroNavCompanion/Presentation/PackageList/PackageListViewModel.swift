import Foundation

@MainActor
final class PackageListViewModel: ObservableObject {
    @Published private(set) var packages: [NavigationPackage]

    init(packages: [NavigationPackage] = [.preview]) {
        self.packages = packages
    }
}

extension NavigationPackage {
    static let preview = NavigationPackage(
        id: "ANAV-DEMO-USA-FD1000",
        cycle: "Demo",
        region: "USA",
        status: .sample
    )
}

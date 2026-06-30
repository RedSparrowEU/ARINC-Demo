import Foundation

@MainActor
final class PackageListViewModel: ObservableObject {
    @Published private(set) var packages: [NavigationPackage]

    init(packages: [NavigationPackage] = SamplePackages.all) {
        self.packages = packages
    }
}

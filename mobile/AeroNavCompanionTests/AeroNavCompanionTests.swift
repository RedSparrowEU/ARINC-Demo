import XCTest
@testable import AeroNavCompanion

final class AeroNavCompanionTests: XCTestCase {
    @MainActor
    func testListLoadsThreeRepresentativeStatuses() {
        let viewModel = PackageListViewModel()

        XCTAssertEqual(viewModel.packages.count, 3)
        XCTAssertEqual(viewModel.packages.map(\.status), [.valid, .warning, .failed])
    }

    @MainActor
    func testListPreservesInjectedPackages() {
        let viewModel = PackageListViewModel(packages: [SamplePackages.failed])

        XCTAssertEqual(viewModel.packages, [SamplePackages.failed])
    }

    @MainActor
    func testDetailsExposeMetadataAndEffectivePeriod() {
        let viewModel = PackageDetailsViewModel(package: SamplePackages.valid)

        XCTAssertEqual(viewModel.package.provider, "AeroNav Data Services Demo")
        XCTAssertEqual(viewModel.package.region, "USA")
        XCTAssertEqual(viewModel.effectivePeriod, "2026-06-30 – 2026-08-05")
    }

    @MainActor
    func testDetailsGroupAndSortFilesByCategory() {
        let viewModel = PackageDetailsViewModel(package: SamplePackages.valid)

        XCTAssertEqual(viewModel.categoryGroups.map(\.category), ["charts", "navigation"])
        XCTAssertEqual(viewModel.categoryGroups[1].files.map(\.path), [
            "navdata/FAACIFP18",
            "navdata/airports-index.json"
        ])
    }

    @MainActor
    func testDetailsSupportEmptyCategories() {
        let empty = NavigationPackage(
            id: "ANAV-2607-USA-FD1000",
            provider: "Demo",
            source: "Generated test data",
            cycle: "2607",
            region: "USA",
            targetDevice: "Demo Device",
            effectiveFrom: Date(timeIntervalSince1970: 0),
            effectiveTo: Date(timeIntervalSince1970: 1),
            status: .warning,
            files: []
        )

        XCTAssertTrue(PackageDetailsViewModel(package: empty).categoryGroups.isEmpty)
    }
}

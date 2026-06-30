import XCTest
@testable import AeroNavCompanion

final class AeroNavCompanionTests: XCTestCase {
    @MainActor
    func testScaffoldExposesNonOperationalSample() {
        let viewModel = PackageListViewModel()

        XCTAssertEqual(viewModel.packages, [.preview])
        XCTAssertEqual(viewModel.packages.first?.status, .sample)
    }
}

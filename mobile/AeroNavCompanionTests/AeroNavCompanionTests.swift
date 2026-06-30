import XCTest
@testable import AeroNavCompanion

final class AeroNavCompanionTests: XCTestCase {
    func testCompactSummaryDecodingAndInvalidPrefix() throws { let summary=CompactDiagnosticsSummary(packageId:"ANAV-2607-USA-FD1000",status:"failed",generatedAt:"2026-06-30T00:00:00Z",summary:"Demo",blocking:1,warning:0);let data=try JSONEncoder().encode(summary);let encoded=data.base64EncodedString().replacingOccurrences(of:"+",with:"-").replacingOccurrences(of:"/",with:"_").replacingOccurrences(of:"=",with:"");XCTAssertEqual(try CompactSummaryCodec.decode("AERONAV1:\(encoded)"),summary);XCTAssertThrowsError(try CompactSummaryCodec.decode("invalid")) }
    @MainActor
    func testBridgeAcceptsScannedValueAndReportsInvalidData() throws { let summary=CompactDiagnosticsSummary(packageId:"ANAV-2607-USA-FD1000",status:"valid",generatedAt:"2026-06-30T00:00:00Z",summary:"0 issues",blocking:0,warning:0);let data=try JSONEncoder().encode(summary);let value="AERONAV1:"+data.base64EncodedString().replacingOccurrences(of:"+",with:"-").replacingOccurrences(of:"/",with:"_").replacingOccurrences(of:"=",with:"");let viewModel=CompanionBridgeViewModel();viewModel.acceptScannedValue(value);XCTAssertEqual(viewModel.text,value);XCTAssertEqual(viewModel.summary,summary);viewModel.acceptScannedValue("invalid");XCTAssertNil(viewModel.summary);XCTAssertNotNil(viewModel.error) }
    func testHistoryStoreRoundTripAndRetention() async throws { let url=FileManager.default.temporaryDirectory.appending(path:UUID().uuidString);let store=JSONValidationHistoryStore(url:url);for index in 0..<105 { try await store.append(.init(id:UUID(),attemptedAt:Date(timeIntervalSince1970:TimeInterval(index)),fileName:"m.json",packageId:nil,status:"Failed",issues:[])) };let records=try await JSONValidationHistoryStore(url:url).load();XCTAssertEqual(records.count,100);XCTAssertGreaterThan(records[0].attemptedAt,records[99].attemptedAt);try? FileManager.default.removeItem(at:url) }
    private struct Loader: ManifestLoading { let data: Data; func loadManifest(from url: URL) async throws -> Data { data } }
    private func manifestData(id:String="ANAV-2607-USA-FD1000", path:String="navdata/demo.txt", hash:String=String(repeating:"0",count:64)) -> Data {
        try! JSONSerialization.data(withJSONObject:["packageId":id,"provider":"Demo","source":"Generated","cycle":"2607","region":"USA","targetDevice":"FlightDeck FD-1000","formatVersion":"1.0","effectiveFrom":"2026-06-30","effectiveTo":"2026-08-05","files":[["path":path,"category":"navigation","required":true,"sha256":hash]]])
    }
    func testManifestImportDecodesAndValidates() async throws { let result=try await ManifestImportService(loader:Loader(data:manifestData())).importManifest(from:URL(fileURLWithPath:"/tmp/manifest.json"),now:Date(timeIntervalSince1970:1_783_033_200)); XCTAssertEqual(result.status,.valid); XCTAssertNotNil(result.package) }
    func testManifestImportRejectsMalformedAndUnsafeContent() async throws { let malformed=try await ManifestImportService(loader:Loader(data:Data("{".utf8))).importManifest(from:URL(fileURLWithPath:"/tmp/manifest.json"),now:Date()); XCTAssertNil(malformed.package); let unsafe=try await ManifestImportService(loader:Loader(data:manifestData(path:"../escape",hash:"bad"))).importManifest(from:URL(fileURLWithPath:"/tmp/manifest.json"),now:Date(timeIntervalSince1970:1_783_033_200)); XCTAssertEqual(unsafe.status,.failed); XCTAssertEqual(unsafe.issues.count,2) }
    func testManifestImportRejectsNonJson() async { do { _=try await ManifestImportService(loader:Loader(data:manifestData())).importManifest(from:URL(fileURLWithPath:"/tmp/manifest.txt"),now:Date()); XCTFail() } catch { XCTAssertNotNil(error as? ManifestImportError) } }
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

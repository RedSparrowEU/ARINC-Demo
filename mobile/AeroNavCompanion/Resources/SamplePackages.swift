import Foundation

enum SamplePackages {
    static let valid = package(
        id: "ANAV-2607-USA-FD1000",
        cycle: "2607",
        region: "USA",
        status: .valid,
        files: [
            .init(
                path: "navdata/FAACIFP18",
                category: "navigation",
                required: true
            ),
            .init(
                path: "navdata/airports-index.json",
                category: "navigation",
                required: true
            ),
            .init(
                path: "charts/KJFK_ILS_04L.pdf",
                category: "charts",
                required: false
            ),
        ]
    )

    static let warning = package(
        id: "ANAV-2608-EUR-FD1000",
        cycle: "2608",
        region: "EUR",
        status: .warning,
        files: [
            .init(
                path: "navdata/demo.txt",
                category: "navigation",
                required: true
            ),
            .init(
                path: "terrain/terrain-index.json",
                category: "terrain",
                required: false
            ),
        ]
    )

    static let failed = package(
        id: "ANAV-2607-USA-FD2000",
        cycle: "2607",
        region: "USA",
        status: .failed,
        files: [
            .init(
                path: "navdata/required-but-absent.txt",
                category: "navigation",
                required: true
            )
        ]
    )

    static let all = [valid, warning, failed]

    private static func package(
        id: String,
        cycle: String,
        region: String,
        status: PackageStatus,
        files: [PackageFileDisplay]
    ) -> NavigationPackage {
        NavigationPackage(
            id: id,
            provider: "AeroNav Data Services Demo",
            source: "Generated non-operational sample data",
            cycle: cycle,
            region: region,
            targetDevice: "FlightDeck Demo Console",
            effectiveFrom: utcDate(year: 2026, month: 6, day: 30),
            effectiveTo: utcDate(year: 2026, month: 8, day: 5),
            status: status,
            files: files
        )
    }

    private static func utcDate(year: Int, month: Int, day: Int) -> Date {
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = TimeZone(secondsFromGMT: 0)!
        return calendar.date(
            from: DateComponents(year: year, month: month, day: day)
        )!
    }
}

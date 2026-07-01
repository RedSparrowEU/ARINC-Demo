# SamplePackages.swift

Source: `Resources/SamplePackages.swift`

## Purpose
This file provides generated non-operational sample packages so the app has meaningful content before any real manifest is imported.

## Architecture Role
Resources layer. It centralizes preview and demo data away from the SwiftUI views.

## App Flow Context
The list view model starts with these sample packages, so the home screen can immediately demonstrate valid, warning, and failed package states.

## Line-by-Line Explanation
- Line 1: `import Foundation` Imports Foundation, which provides core Swift types such as `Date`, `URL`, `UUID`, `JSONDecoder`, and file-system utilities used by this app.
- Line 2: `<blank>` Blank line used only for visual separation between related pieces of code.
- Line 3: `enum SamplePackages {` Declares the enum `SamplePackages`. Enums model a fixed set of cases, which is useful for statuses and UI states.
- Line 4: `static let valid = package(` The source on this line is `static let valid = package(`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 5: `id: "ANAV-2607-USA-FD1000",` The source on this line is `id: "ANAV-2607-USA-FD1000",`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 6: `cycle: "2607",` The source on this line is `cycle: "2607",`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 7: `region: "USA",` The source on this line is `region: "USA",`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 8: `status: .valid,` The source on this line is `status: .valid,`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 9: `files: [` The source on this line is `files: [`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 10: `.init(` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 11: `path: "navdata/FAACIFP18",` The source on this line is `path: "navdata/FAACIFP18",`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 12: `category: "navigation",` The source on this line is `category: "navigation",`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 13: `required: true` The source on this line is `required: true`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 14: `),` The source on this line is `),`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 15: `.init(` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 16: `path: "navdata/airports-index.json",` The source on this line is `path: "navdata/airports-index.json",`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 17: `category: "navigation",` The source on this line is `category: "navigation",`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 18: `required: true` The source on this line is `required: true`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 19: `),` The source on this line is `),`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 20: `.init(` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 21: `path: "charts/KJFK_ILS_04L.pdf",` The source on this line is `path: "charts/KJFK_ILS_04L.pdf",`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 22: `category: "charts",` The source on this line is `category: "charts",`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 23: `required: false` The source on this line is `required: false`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 24: `),` The source on this line is `),`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 25: `]` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 26: `)` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 27: `<blank>` Blank line used only for visual separation between related pieces of code.
- Line 28: `static let warning = package(` The source on this line is `static let warning = package(`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 29: `id: "ANAV-2608-EUR-FD1000",` The source on this line is `id: "ANAV-2608-EUR-FD1000",`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 30: `cycle: "2608",` The source on this line is `cycle: "2608",`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 31: `region: "EUR",` The source on this line is `region: "EUR",`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 32: `status: .warning,` The source on this line is `status: .warning,`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 33: `files: [` The source on this line is `files: [`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 34: `.init(` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 35: `path: "navdata/demo.txt",` The source on this line is `path: "navdata/demo.txt",`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 36: `category: "navigation",` The source on this line is `category: "navigation",`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 37: `required: true` The source on this line is `required: true`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 38: `),` The source on this line is `),`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 39: `.init(` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 40: `path: "terrain/terrain-index.json",` The source on this line is `path: "terrain/terrain-index.json",`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 41: `category: "terrain",` The source on this line is `category: "terrain",`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 42: `required: false` The source on this line is `required: false`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 43: `),` The source on this line is `),`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 44: `]` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 45: `)` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 46: `<blank>` Blank line used only for visual separation between related pieces of code.
- Line 47: `static let failed = package(` The source on this line is `static let failed = package(`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 48: `id: "ANAV-2607-USA-FD2000",` The source on this line is `id: "ANAV-2607-USA-FD2000",`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 49: `cycle: "2607",` The source on this line is `cycle: "2607",`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 50: `region: "USA",` The source on this line is `region: "USA",`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 51: `status: .failed,` The source on this line is `status: .failed,`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 52: `files: [` The source on this line is `files: [`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 53: `.init(` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 54: `path: "navdata/required-but-absent.txt",` The source on this line is `path: "navdata/required-but-absent.txt",`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 55: `category: "navigation",` The source on this line is `category: "navigation",`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 56: `required: true` The source on this line is `required: true`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 57: `)` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 58: `]` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 59: `)` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 60: `<blank>` Blank line used only for visual separation between related pieces of code.
- Line 61: `static let all = [valid, warning, failed]` The source on this line is `static let all = [valid, warning, failed]`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 62: `<blank>` Blank line used only for visual separation between related pieces of code.
- Line 63: `private static func package(` Starts the function `package`. Functions group behavior into a reusable named operation.
- Line 64: `id: String,` The source on this line is `id: String,`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 65: `cycle: String,` The source on this line is `cycle: String,`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 66: `region: String,` The source on this line is `region: String,`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 67: `status: PackageStatus,` The source on this line is `status: PackageStatus,`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 68: `files: [PackageFileDisplay]` The source on this line is `files: [PackageFileDisplay]`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 69: `) -> NavigationPackage {` The source on this line is `) -> NavigationPackage {`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 70: `NavigationPackage(` The source on this line is `NavigationPackage(`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 71: `id: id,` The source on this line is `id: id,`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 72: `provider: "AeroNav Data Services Demo",` The source on this line is `provider: "AeroNav Data Services Demo",`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 73: `source: "Generated non-operational sample data",` The source on this line is `source: "Generated non-operational sample data",`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 74: `cycle: cycle,` The source on this line is `cycle: cycle,`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 75: `region: region,` The source on this line is `region: region,`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 76: `targetDevice: "FlightDeck Demo Console",` The source on this line is `targetDevice: "FlightDeck Demo Console",`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 77: `effectiveFrom: utcDate(year: 2026, month: 6, day: 30),` The source on this line is `effectiveFrom: utcDate(year: 2026, month: 6, day: 30),`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 78: `effectiveTo: utcDate(year: 2026, month: 8, day: 5),` The source on this line is `effectiveTo: utcDate(year: 2026, month: 8, day: 5),`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 79: `status: status,` The source on this line is `status: status,`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 80: `files: files` The source on this line is `files: files`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 81: `)` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 82: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 83: `<blank>` Blank line used only for visual separation between related pieces of code.
- Line 84: `private static func utcDate(year: Int, month: Int, day: Int) -> Date {` Starts the function `utcDate`. Functions group behavior into a reusable named operation.
- Line 85: `var calendar = Calendar(identifier: .gregorian)` Declares a `var` property. `var` means the value may change later, or at least is not guaranteed to stay constant.
- Line 86: `calendar.timeZone = TimeZone(secondsFromGMT: 0)!` The source on this line is `calendar.timeZone = TimeZone(secondsFromGMT: 0)!`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 87: `return calendar.date(` Returns a value from the current function or computed property.
- Line 88: `from: DateComponents(year: year, month: month, day: day)` The source on this line is `from: DateComponents(year: year, month: month, day: day)`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 89: `)!` The source on this line is `)!`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 90: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 91: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.

## Why This File Matters
This file provides generated non-operational sample packages so the app has meaningful content before any real manifest is imported.

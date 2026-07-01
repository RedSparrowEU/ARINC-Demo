# DiagnosticsImportService.swift

Source: `Services/DiagnosticsImportService.swift`

## Purpose
This file defines the diagnostics-report data model and the service that reads a desktop diagnostics JSON file into that model.

## Architecture Role
Services layer. It combines a raw file loader with schema checks so the UI only receives well-formed diagnostics reports.

## App Flow Context
`DiagnosticsViewModel` calls this service after file selection, and the returned report is then grouped and rendered in the diagnostics sheet.

## Line-by-Line Explanation
- Line 1: `import Foundation` Imports Foundation, which provides core Swift types such as `Date`, `URL`, `UUID`, `JSONDecoder`, and file-system utilities used by this app.
- Line 2: `<blank>` Blank line used only for visual separation between related pieces of code.
- Line 3: `struct DiagnosticsReport: Codable, Equatable, Sendable {` Declares the Swift `struct` named `DiagnosticsReport`. Structs are value types, which makes them a common fit for data models and SwiftUI views.
- Line 4: `struct AppInfo: Codable, Equatable, Sendable {` Declares the Swift `struct` named `AppInfo`. Structs are value types, which makes them a common fit for data models and SwiftUI views.
- Line 5: `let name, version, platform: String` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 6: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 7: `struct Operation: Codable, Equatable, Sendable { let type, status: String }` Declares the Swift `struct` named `Operation`. Structs are value types, which makes them a common fit for data models and SwiftUI views.
- Line 8: `struct PackageInfo: Codable, Equatable, Sendable {` Declares the Swift `struct` named `PackageInfo`. Structs are value types, which makes them a common fit for data models and SwiftUI views.
- Line 9: `let packageId, cycle, region, targetDevice: String` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 10: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 11: `struct Summary: Codable, Equatable, Sendable {` Declares the Swift `struct` named `Summary`. Structs are value types, which makes them a common fit for data models and SwiftUI views.
- Line 12: `let info, warning, error, blocking, total: Int` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 13: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 14: `struct Issue: Codable, Identifiable, Equatable, Sendable {` Declares the Swift `struct` named `Issue`. Structs are value types, which makes them a common fit for data models and SwiftUI views.
- Line 15: `var id: String { "\(code)-\(path ?? "")" }` Starts a computed property. Swift runs the enclosed code each time the property is read instead of storing a separate value.
- Line 16: `let code, severity, message: String` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 17: `let path: String?` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 18: `let suggestedAction: String` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 19: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 20: `let schemaVersion: Int` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 21: `let reportId, generatedAt: String` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 22: `let application: AppInfo` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 23: `let operation: Operation` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 24: `let package: PackageInfo` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 25: `let summary: Summary` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 26: `let issues: [Issue]` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 27: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 28: `protocol DiagnosticsImporting: Sendable {` Declares the protocol `DiagnosticsImporting`. In Swift, a protocol is an interface that describes required behavior without choosing the concrete implementation.
- Line 29: `func load(from: URL) async throws -> DiagnosticsReport` Starts the function `load`. Functions group behavior into a reusable named operation.
- Line 30: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 31: `struct DiagnosticsImportService: DiagnosticsImporting {` Declares the Swift `struct` named `DiagnosticsImportService`. Structs are value types, which makes them a common fit for data models and SwiftUI views.
- Line 32: `let loader: any ManifestLoading` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 33: `init(loader: any ManifestLoading = LocalManifestLoader()) {` Starts an initializer. `init` is Swift’s constructor and is responsible for preparing a new instance with valid stored properties.
- Line 34: `self.loader = loader` The source on this line is `self.loader = loader`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 35: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 36: `func load(from url: URL) async throws -> DiagnosticsReport {` Starts the function `load`. Functions group behavior into a reusable named operation.
- Line 37: `guard url.pathExtension.lowercased() == "json" else {` Starts a `guard` statement. Swift uses `guard` for required preconditions and exits early if the condition is not satisfied.
- Line 38: `throw ManifestImportError.invalidType` Throws an error. That stops normal execution here and hands the failure to the nearest caller that handles errors.
- Line 39: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 40: `let report = try JSONDecoder().decode(` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 41: `DiagnosticsReport.self,` The source on this line is `DiagnosticsReport.self,`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 42: `from: await loader.loadManifest(from: url)` The source on this line is `from: await loader.loadManifest(from: url)`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 43: `)` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 44: `guard report.schemaVersion == 1 else {` Starts a `guard` statement. Swift uses `guard` for required preconditions and exits early if the condition is not satisfied.
- Line 45: `throw CocoaError(.fileReadCorruptFile)` Throws an error. That stops normal execution here and hands the failure to the nearest caller that handles errors.
- Line 46: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 47: `return report` Returns a value from the current function or computed property.
- Line 48: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 49: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.

## Why This File Matters
This file defines the diagnostics-report data model and the service that reads a desktop diagnostics JSON file into that model.

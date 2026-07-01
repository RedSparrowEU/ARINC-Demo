# ValidationHistoryStoring.swift

Source: `Persistence/ValidationHistoryStoring.swift`

## Purpose
This file defines how validation attempts are stored and provides the JSON-backed implementation used by the mobile app history screen.

## Architecture Role
Persistence layer. It keeps import outcomes on disk in a bounded JSON file so the history screen can survive app restarts.

## App Flow Context
The package list view model appends a record after each import attempt, and `HistoryViewModel` loads those records for display.

## Line-by-Line Explanation
- Line 1: `import Foundation` Imports Foundation, which provides core Swift types such as `Date`, `URL`, `UUID`, `JSONDecoder`, and file-system utilities used by this app.
- Line 2: `<blank>` Blank line used only for visual separation between related pieces of code.
- Line 3: `struct ValidationHistoryRecord: Codable, Identifiable, Equatable, Sendable {` Declares the Swift `struct` named `ValidationHistoryRecord`. Structs are value types, which makes them a common fit for data models and SwiftUI views.
- Line 4: `let id: UUID` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 5: `let attemptedAt: Date` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 6: `let fileName: String` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 7: `let packageId: String?` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 8: `let status: String` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 9: `let issues: [String]` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 10: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 11: `protocol ValidationHistoryStoring: Sendable {` Declares the protocol `ValidationHistoryStoring`. In Swift, a protocol is an interface that describes required behavior without choosing the concrete implementation.
- Line 12: `func load() async throws -> [ValidationHistoryRecord]` Starts the function `load`. Functions group behavior into a reusable named operation.
- Line 13: `func append(_ record: ValidationHistoryRecord) async throws` Starts the function `append`. Functions group behavior into a reusable named operation.
- Line 14: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 15: `actor JSONValidationHistoryStore: ValidationHistoryStoring {` Declares the actor `JSONValidationHistoryStore`. Actors protect mutable state from unsafe concurrent access, which matters for shared file-backed history.
- Line 16: `struct Envelope: Codable {` Declares the Swift `struct` named `Envelope`. Structs are value types, which makes them a common fit for data models and SwiftUI views.
- Line 17: `let schemaVersion: Int` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 18: `var entries: [ValidationHistoryRecord]` Declares a `var` property. `var` means the value may change later, or at least is not guaranteed to stay constant.
- Line 19: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 20: `let url: URL` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 21: `init(` Starts an initializer. `init` is Swift’s constructor and is responsible for preparing a new instance with valid stored properties.
- Line 22: `url: URL = FileManager.default.urls(` The source on this line is `url: URL = FileManager.default.urls(`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 23: `for: .applicationSupportDirectory,` The source on this line is `for: .applicationSupportDirectory,`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 24: `in: .userDomainMask` The source on this line is `in: .userDomainMask`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 25: `)[0].appending(path: "AeroNavCompanion/validation-history-v1.json")` The source on this line is `)[0].appending(path: "AeroNavCompanion/validation-history-v1.json")`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 26: `) { self.url = url }` The source on this line is `) { self.url = url }`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 27: `func load() throws -> [ValidationHistoryRecord] {` Starts the load method for persisted validation history. It reads the JSON file, verifies the schema version, and returns the newest records first.
- Line 28: `guard FileManager.default.fileExists(atPath: url.path) else {` Starts a `guard` statement. Swift uses `guard` for required preconditions and exits early if the condition is not satisfied.
- Line 29: `return []` Returns a value from the current function or computed property.
- Line 30: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 31: `let envelope = try JSONDecoder.iso.decode(` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 32: `Envelope.self,` The source on this line is `Envelope.self,`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 33: `from: Data(contentsOf: url)` The source on this line is `from: Data(contentsOf: url)`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 34: `)` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 35: `guard envelope.schemaVersion == 1 else {` Starts a `guard` statement. Swift uses `guard` for required preconditions and exits early if the condition is not satisfied.
- Line 36: `throw CocoaError(.fileReadCorruptFile)` Throws an error. That stops normal execution here and hands the failure to the nearest caller that handles errors.
- Line 37: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 38: `return envelope.entries.sorted { $0.attemptedAt > $1.attemptedAt }` Returns a value from the current function or computed property.
- Line 39: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 40: `func append(_ record: ValidationHistoryRecord) throws {` Starts the append method for persisted validation history. It prepends the newest record, trims the list to 100 items, and writes the updated JSON atomically.
- Line 41: `var entries = (try? load()) ?? []` Declares a `var` property. `var` means the value may change later, or at least is not guaranteed to stay constant.
- Line 42: `entries.insert(record, at: 0)` The source on this line is `entries.insert(record, at: 0)`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 43: `entries = Array(entries.prefix(100))` The source on this line is `entries = Array(entries.prefix(100))`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 44: `try FileManager.default.createDirectory(` The source on this line is `try FileManager.default.createDirectory(`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 45: `at: url.deletingLastPathComponent(),` The source on this line is `at: url.deletingLastPathComponent(),`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 46: `withIntermediateDirectories: true` The source on this line is `withIntermediateDirectories: true`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 47: `)` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 48: `try JSONEncoder.iso.encode(Envelope(schemaVersion: 1, entries: entries))` This line continues the surrounding Swift statement with additional arguments, data, or formatting.
- Line 49: `.write(to: url, options: .atomic)` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 50: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 51: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 52: `extension JSONDecoder {` Starts an extension on `JSONDecoder`. Extensions let Swift add focused helpers without changing the original type definition.
- Line 53: `fileprivate static var iso: JSONDecoder {` The source on this line is `fileprivate static var iso: JSONDecoder {`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 54: `let d = JSONDecoder()` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 55: `d.dateDecodingStrategy = .iso8601` The source on this line is `d.dateDecodingStrategy = .iso8601`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 56: `return d` Returns a value from the current function or computed property.
- Line 57: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 58: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 59: `extension JSONEncoder {` Starts an extension on `JSONEncoder`. Extensions let Swift add focused helpers without changing the original type definition.
- Line 60: `fileprivate static var iso: JSONEncoder {` The source on this line is `fileprivate static var iso: JSONEncoder {`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 61: `let e = JSONEncoder()` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 62: `e.dateEncodingStrategy = .iso8601` The source on this line is `e.dateEncodingStrategy = .iso8601`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 63: `return e` Returns a value from the current function or computed property.
- Line 64: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 65: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.

## Why This File Matters
This file defines how validation attempts are stored and provides the JSON-backed implementation used by the mobile app history screen.

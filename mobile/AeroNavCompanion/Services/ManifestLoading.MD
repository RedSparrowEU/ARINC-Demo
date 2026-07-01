# ManifestLoading.swift

Source: `Services/ManifestLoading.swift`

## Purpose
This file abstracts low-level file loading and provides the concrete loader that safely reads imported files from iOS document locations.

## Architecture Role
Services layer. It hides security-scoped file access and background reading behind a small protocol.

## App Flow Context
Both manifest import and diagnostics import use this loader so file access logic stays in one place.

## Line-by-Line Explanation
- Line 1: `import Foundation` Imports Foundation, which provides core Swift types such as `Date`, `URL`, `UUID`, `JSONDecoder`, and file-system utilities used by this app.
- Line 2: `<blank>` Blank line used only for visual separation between related pieces of code.
- Line 3: `protocol ManifestLoading: Sendable {` Declares the protocol `ManifestLoading`. In Swift, a protocol is an interface that describes required behavior without choosing the concrete implementation.
- Line 4: `func loadManifest(from url: URL) async throws -> Data` Starts the function `loadManifest`. Functions group behavior into a reusable named operation.
- Line 5: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 6: `<blank>` Blank line used only for visual separation between related pieces of code.
- Line 7: `struct LocalManifestLoader: ManifestLoading {` Declares the Swift `struct` named `LocalManifestLoader`. Structs are value types, which makes them a common fit for data models and SwiftUI views.
- Line 8: `func loadManifest(from url: URL) async throws -> Data {` Starts the function `loadManifest`. Functions group behavior into a reusable named operation.
- Line 9: `let scoped = url.startAccessingSecurityScopedResource()` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 10: `defer { if scoped { url.stopAccessingSecurityScopedResource() } }` Uses `defer` so security-scoped access is always released when the function exits, even if reading fails partway through.
- Line 11: `return try await Task.detached(priority: .userInitiated) {` Returns the file data by starting detached work on a background thread. This keeps file I/O off the main actor used for UI updates.
- Line 12: `try Data(contentsOf: url)` The source on this line is `try Data(contentsOf: url)`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 13: `}.value` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 14: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 15: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.

## Why This File Matters
This file abstracts low-level file loading and provides the concrete loader that safely reads imported files from iOS document locations.

# NavigationPackage.swift

Source: `Domain/NavigationPackage.swift`

## Purpose
Defines the core data models shared by list, detail, import, and diagnostics flows in the mobile app.

## Architecture Role
Domain layer. These are Swift value types that describe packages without UI code.

## App Flow Context
Sample data, imported manifests, and view models all pass around these types so the rest of the app can talk about one consistent package model.

## Swift Concepts To Notice
- `Identifiable`: Used heavily by SwiftUI collections. A type that exposes a stable `id` can drive `List` and `ForEach` diffing without separate index bookkeeping.
- `Equatable`: Lets Swift compare two values for equality, which is useful in tests and state comparisons.
- `Sendable`: Marks a value as safe to move across Swift concurrency boundaries. For these immutable structs, that matches the app’s async import/history flows well.
- `enum ... : String`: A raw-value enum stores a typed case in code but can still expose a user-facing string like `"Valid"` for the UI.
- Computed `id` properties: Swift allows tiny derived properties such as `var id: String { path }` without storing duplicate data.

## Semantic Walkthrough
- Line 1: Imports Foundation for `Date`, which the package model uses for effective cycle dates.
- Lines 3-13: Define `NavigationPackage` as a struct with immutable `let` fields. Using a struct here gives value semantics: if a package is copied or replaced during import, the UI gets a new snapshot rather than shared mutable state. The conformance list means a package can be rendered in SwiftUI lists (`Identifiable`), compared in tests (`Equatable`), and passed through async code (`Sendable`).
- Lines 16-20: Define `PackageStatus` as a `String`-backed enum. `CaseIterable` is a Swift convenience that synthesizes an `allCases` collection, useful any time the UI or tests need to iterate over the legal states.
- Lines 22-27: Define `PackageFileDisplay`, the per-file model used by the details screen. The computed `id` derives directly from `path`, which is a common Swift pattern when one field is already unique enough to serve as stable identity.
- Lines 29-33: Define `PackageCategoryGroup`, which packages files by category for sectioned display. Again, the group derives identity from an existing field instead of storing a duplicate identifier.

## Why This File Matters
Defines the core data models shared by list, detail, import, and diagnostics flows in the mobile app.

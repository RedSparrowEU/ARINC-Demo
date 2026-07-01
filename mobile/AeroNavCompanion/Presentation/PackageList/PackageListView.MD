# PackageListView.swift

Source: `Presentation/PackageList/PackageListView.swift`

## Purpose
Implements the home screen: package list, import banner, modal entry points, and the non-operational demo footer.

## Architecture Role
Presentation layer. This view owns view-local UI state and delegates business logic to `PackageListViewModel`.

## App Flow Context
The app launches into this screen, which lists packages, navigates to details, imports manifests, and opens the history, diagnostics, and bridge sheets.

## Swift Concepts To Notice
- `@StateObject` vs `@State`: Use `@StateObject` for long-lived reference state such as a view model, and `@State` for simple value state such as booleans that drive sheets.
- `some View` and opaque UI composition: Both `body` and `importBanner` return `some View`, which lets SwiftUI compose large view trees without exposing their concrete nested generic types.
- `@ViewBuilder` result builders: A result builder lets one property or closure return different view branches without manually boxing them into one explicit type.
- Bindings via `$`: The dollar-sign form passes a mutable binding into controls or modifiers, such as `fileImporter` and `sheet`, instead of a plain value copy.
- Pattern matching in callbacks: `if case let .success(url) = result` is Swift pattern matching, not a special file-import API feature. It destructures one enum case inline.
- Nested view types: Swift commonly nests tiny helper views in the same file to keep local UI composition private and discoverable.

## Semantic Walkthrough
- Lines 1-2: Import SwiftUI for the UI layer and UniformTypeIdentifiers because `fileImporter` needs the JSON content-type declaration.
- Lines 4-13: Declare the root view and model its local state. `@StateObject` owns the list view model, while the four `@State` booleans are plain value-state flags for modal presentation and importer display. The custom initializer uses `StateObject(wrappedValue:)` so an injected model is preserved correctly.
- Lines 15-23: Implement `body: some View` with a `NavigationStack` containing a `List(viewModel.packages)`. `NavigationLink` is SwiftUI’s typed push navigation API, and the destination closure constructs a fresh detail view model from the tapped package.
- Lines 24-30: Apply the main interaction modifiers: title, toolbar buttons, three modal sheets, the JSON file importer, and the top import banner inset. This block is where SwiftUI’s chaining style matters most: every modifier returns another view value. The importer callback uses `if case let .success(url) = result` plus `Task { await ... }` because the callback itself is synchronous but the import function is async.
- Lines 31-43: Attach an overlay for the empty state and a bottom `safeAreaInset` for the persistent demo disclaimer. These are layout modifiers rather than imperative “draw now” commands, which is a key SwiftUI mindset shift if you come from UIKit or React Native.
- Line 46: Define `importBanner` as `@ViewBuilder private var importBanner: some View`. This is a strong Swift-specific construct: the property returns different concrete views depending on `viewModel.importState`, but the result builder stitches them into one valid `some View` API surface without manual type erasure.
- Lines 49-68: Define `PackageRow` as a nested private view. Keeping it private limits its visibility to this file, and using a separate `View` type keeps the main body readable while still preserving normal SwiftUI value semantics.
- Lines 70-90: Define `StatusBadge`, another nested view. The `body: some View` property demonstrates modifier chaining, while the private computed `color` property uses a `switch` over the enum instead of stringly-typed status logic.
- Lines 92-94: Provide an Xcode preview for the home screen using the default sample-data-backed view model.

## Why This File Matters
Implements the home screen: package list, import banner, modal entry points, and the non-operational demo footer.

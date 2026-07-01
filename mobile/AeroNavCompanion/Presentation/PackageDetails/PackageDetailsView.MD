# PackageDetailsView.swift

Source: `Presentation/PackageDetails/PackageDetailsView.swift`

## Purpose
Renders one package in detail, including status, metadata, and the grouped file list.

## Architecture Role
Presentation layer. This view stays declarative and relies on its view model for prepared display data.

## App Flow Context
A row tap on the home screen pushes this view, which then reads the selected package and category groups from `PackageDetailsViewModel`.

## Swift Concepts To Notice
- `@StateObject` with `wrappedValue` injection: When a view receives an already-constructed observable object, `StateObject(wrappedValue:)` tells SwiftUI to take ownership without recreating it on every redraw.
- `some View`: Every `body` in SwiftUI returns an opaque concrete view type. That keeps call sites abstract while preserving compile-time layout typing.
- `LabeledContent`: A SwiftUI convenience for label/value rows, similar in spirit to a description list or form row in other UI systems.
- Nested `ForEach`: SwiftUI uses `Identifiable` models to build sectioned repeated content without explicit indices.

## Semantic Walkthrough
- Line 1: Imports SwiftUI for all view declarations and modifiers in this file.
- Lines 3-8: Declare the view and inject the observable view model through `StateObject(wrappedValue:)`. The Swift-specific point is ownership: `@StateObject` means SwiftUI, not the caller, is responsible for preserving that reference across view recomputation.
- Lines 10-17: Start the `body: some View` implementation and render the status section. The trailing-closure form of `LabeledContent` is useful when the value side is not just text but another view, here `StatusBadge`.
- Lines 19-27: Render package metadata as label/value pairs. Because `NavigationPackage` is immutable, this section is a direct read-only projection of model fields.
- Lines 29-40: Render the file list with nested `ForEach`. SwiftUI can diff these collections because both the groups and the file rows conform to `Identifiable`.
- Lines 42-49: Handle the empty-files case and apply navigation modifiers. The modifier chain is typical SwiftUI style: the expression stays immutable while each modifier returns a new view value.
- Lines 53-57: Provide an Xcode preview. `#Preview` is build-time tooling syntax, not production runtime logic, and the preview wraps the detail screen in a `NavigationStack` so titles render as they would in the app.

## Why This File Matters
Renders one package in detail, including status, metadata, and the grouped file list.

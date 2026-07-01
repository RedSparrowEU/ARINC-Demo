# HistoryView.swift

Source: `Presentation/History/HistoryView.swift`

## Purpose
Implements the validation history sheet and the view model that loads stored import attempts.

## Architecture Role
Presentation layer. It translates persisted history records into SwiftUI states.

## App Flow Context
The package list opens this sheet, the view model loads records from the history store, and the view shows an empty, error, loading, or populated state.

## Swift Concepts To Notice
- `any ValidationHistoryStoring`: Again, `any` marks an existential dependency so the view model talks to the protocol instead of a hard-coded store implementation.
- `@StateObject` with injected models: SwiftUI can own an observable object even when the caller constructs it first, which is how this sheet receives its view model from the package list.
- `\.self` in `ForEach`: Using `id: \.self` means each string value is its own identity. That is acceptable here because the issues array is just a list of text labels.
- `.task { ... }`: The `task` modifier is SwiftUI’s built-in hook for running async work when a view appears.

## Semantic Walkthrough
- Line 1: Imports SwiftUI for the sheet and list UI.
- Line 2: Defines `HistoryViewModel` as a main-actor observable object. The `State` enum stores either no payload, an array payload, or an error payload, and the `load()` method awaits the store existential before collapsing the result into one enum case the view can switch over.
- Line 3: Defines the sheet view. The body is an opaque `some View`, state is rendered through a `switch`, the populated state uses `List(records)` plus `ForEach(record.issues, id: \.self)`, and `.task { await viewModel.load() }` kicks off loading when the sheet appears.

## Why This File Matters
Implements the validation history sheet and the view model that loads stored import attempts.

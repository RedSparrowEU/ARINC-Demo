# DiagnosticsView.swift

Source: `Presentation/Diagnostics/DiagnosticsView.swift`

## Purpose
Implements the diagnostics sheet and its view model for loading a desktop diagnostics report and rendering grouped issues.

## Architecture Role
Presentation layer. The view model manages loading state while the view maps that state into SwiftUI screens.

## App Flow Context
The user imports a diagnostics JSON file, the view model decodes it through a protocol-based importer, and the UI renders either empty, loading, error, or grouped-results content.

## Swift Concepts To Notice
- `any DiagnosticsImporting`: The `any` keyword makes the existential explicit: this variable can hold any concrete type that conforms to the protocol. Swift now asks you to spell that distinction out instead of implying it.
- Enums with associated values: The `State` enum stores extra payloads such as `DiagnosticsReport` or an error message directly in the case.
- `Task { ... }` from UI callbacks: SwiftUI closures are not implicitly async, so a `Task` is the normal way to hop from a synchronous event callback into async work.
- Key paths like `\.0`: Swift key paths are typed references to properties. Here `\.0` refers to the first element of each tuple returned by `groups`.

## Semantic Walkthrough
- Line 1: Imports SwiftUI for the sheet UI and property wrappers.
- Line 2: Defines `DiagnosticsViewModel` as a main-actor observable reference type. The nested `State` enum shows associated values, `importer:any DiagnosticsImporting` demonstrates an explicit existential dependency, `load(_:)` awaits the importer and captures failures into state, and `groups(_:)` uses `compactMap` plus closures to transform the flat issue list into severity buckets that the view can render section by section.
- Line 3: Defines the SwiftUI sheet as `some View`. The view owns its model via `@StateObject`, reads the dismiss action from `@Environment`, switches over the enum state to produce different view trees, uses `ForEach` for dynamic sections, and wraps the import callback in `Task { await ... }` because `fileImporter` gives a synchronous closure.

## Why This File Matters
Implements the diagnostics sheet and its view model for loading a desktop diagnostics report and rendering grouped issues.

# DiagnosticsImportService.swift

Source: `Services/DiagnosticsImportService.swift`

## Purpose
Defines the diagnostics report schema and the importer that decodes a report from JSON.

## Architecture Role
Service layer. It converts raw imported data into a typed diagnostics model before the UI sees it.

## App Flow Context
The diagnostics view model asks this service to load a selected JSON file, then groups the resulting `DiagnosticsReport` issues for display.

## Swift Concepts To Notice
- Nested schema types: Swift often nests related structs inside a larger model to make ownership and naming explicit without polluting the global namespace.
- `any ManifestLoading`: The importer depends on a protocol existential so file-access mechanics can be swapped independently from report decoding logic.
- Computed identity: The nested `Issue` struct derives `id` from other fields instead of storing a dedicated persisted id.
- `async throws` service boundary: The UI awaits I/O and handles validation failures explicitly instead of hiding them in callbacks.

## Semantic Walkthrough
- Line 1: Imports Foundation for JSON decoding, URLs, and Cocoa errors.
- Line 2: Defines the `DiagnosticsReport` schema and its nested subtypes on one compact line. The interesting Swift features are synthesized `Codable` support, nested type names like `DiagnosticsReport.Issue`, and the computed `id` property that lets SwiftUI identify issue rows without adding another stored field to the wire format.
- Line 3: Declares the `DiagnosticsImporting` protocol as an async/throwing boundary. The view model can code against this abstraction without knowing how files are actually loaded.
- Line 4: Implements `DiagnosticsImportService` with dependency injection through `any ManifestLoading`. The `guard` on the path extension rejects non-JSON early, the decode call passes `DiagnosticsReport.self` into the generic decoder API, and the second `guard` enforces a schema-version contract before handing the report to the UI.

## Why This File Matters
Defines the diagnostics report schema and the importer that decodes a report from JSON.

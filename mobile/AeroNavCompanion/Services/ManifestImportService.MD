# ManifestImportService.swift

Source: `Services/ManifestImportService.swift`

## Purpose
Defines manifest import result types and the validation service that converts JSON manifests into domain packages plus issues.

## Architecture Role
Service layer. This file contains the main mobile-side validation rules for imported manifests.

## App Flow Context
The package list view model hands a file URL here; this service reads the file, decodes a DTO, validates identity and dates, checks file declarations, and returns a `ManifestImportOutcome` for the UI.

## Swift Concepts To Notice
- DTO vs domain model: `ManifestDTO` matches the JSON wire format, while `NavigationPackage` is the app’s internal domain model. Swift often keeps those shapes separate.
- `LocalizedError`: Swift errors can expose a user-facing `errorDescription`, which is why invalid-type and too-large failures map cleanly into UI text.
- `any ManifestLoading`: Explicit existential dependency injection keeps file I/O isolated from validation logic.
- Regex via `range(of:options:)`: Foundation regex hooks are available directly on strings; this code uses them for cycle and SHA-256 validation without a separate regex object.
- `Substring`: The package id split returns substrings, so comparisons to `dto.cycle` and `dto.region` convert the right-hand side into `Substring` too.
- Ternary classification and key-path mapping: Swift’s ternary operator and key-path shorthand keep the final status/issue projection concise without sacrificing types.

## Semantic Walkthrough
- Line 1: Imports Foundation for URL handling, dates, and JSON decoding.
- Lines 3-5: Define the small result and error types used by the importer. `MobileValidationIssue` is `Identifiable` for SwiftUI display, `ManifestImportOutcome` packages the optional success value plus issues, and `ManifestImportError` uses `LocalizedError` so the UI can show friendly messages directly from the error type.
- Lines 7-11: Define `ManifestDTO` and its nested `FileDTO`. This is the JSON-facing shape, kept separate from `NavigationPackage` so wire concerns stay decoupled from UI/domain concerns.
- Lines 13-17: Declare the protocol and concrete service. `loader:any ManifestLoading` is an explicit existential dependency, and the initializer uses a default concrete implementation so callers can inject a fake only when they need to.
- Lines 18-22: Handle the first gatekeeping stage: reject non-JSON files, reject files over 1 MB, await file loading, then decode with `JSONDecoder`. The `do`/`catch` returns a `ManifestImportOutcome` instead of rethrowing on malformed content, which means structural manifest errors are treated as validation feedback rather than hard UI failures.
- Lines 23-27: Build up validation state. The service accumulates `issues`, splits `packageId` into `Substring` parts, checks semantic consistency between the id/cycle/region, configures a `DateFormatter`, and validates the date strings before continuing.
- Lines 28-31: Apply domain validation rules: end-before-start, expired package, future package, unsafe file paths, and invalid SHA-256 declarations. Swift closures are used heavily here, both in the file-size check and in per-file loops and regex lookups.
- Lines 32-34: Derive the final `status`, map the DTO into a `NavigationPackage`, and return `ManifestImportOutcome`. The `dto.files.map { .init(...) }` expression is a good Swift example of transforming transport data into app-facing value types in one typed pipeline.

## Why This File Matters
Defines manifest import result types and the validation service that converts JSON manifests into domain packages plus issues.

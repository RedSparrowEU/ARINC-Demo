# AeroNavCompanion Source Overview

## Purpose
This folder contains the source of the iOS AeroNav Companion app. The app is a non-operational mobile companion for inspecting navigation package metadata, reviewing validation history, opening diagnostics reports produced by the desktop app, and optionally decoding compact diagnostics summaries from text or QR codes.

## How To Read These Docs
These companion Markdown files are now organized around Swift concepts and app behavior, not around punctuation or blank-line narration. Each file explains the constructs that actually matter to a programmer new to Swift: opaque return types such as `some View`, explicit existential types such as `any ManifestLoading`, property wrappers, actors, result builders, key paths, and SwiftUI’s modifier/binding model.

## Folder Structure
- `App/` contains the SwiftUI app entry point.
- `Domain/` contains shared value types such as packages, statuses, and grouped files.
- `Persistence/` contains the history storage protocol and JSON-backed actor implementation.
- `Presentation/` contains SwiftUI screens and their view models.
- `Resources/` contains generated non-operational sample data.
- `Services/` contains file-loading, manifest import, and diagnostics import logic.

## Main Runtime Flow
1. `App/AeroNavCompanionApp.swift` launches the app and composes the root package list screen.
2. `Presentation/PackageList` renders sample or imported packages and exposes navigation to details, history, diagnostics, and bridge flows.
3. `Services/ManifestImportService.swift` reads picked manifest files, validates them, and maps them into `NavigationPackage` domain values.
4. `Persistence/ValidationHistoryStoring.swift` records import attempts so `Presentation/History` can render them later.
5. `Services/DiagnosticsImportService.swift` reads desktop diagnostics reports for `Presentation/Diagnostics`.
6. `Presentation/Bridge/CompanionBridgeView.swift` decodes compact summaries entered manually or scanned from QR codes.

## Recommended Reading Order
1. Start with [App/AeroNavCompanionApp.MD](App/AeroNavCompanionApp.MD) to understand SwiftUI app startup.
2. Read [Domain/NavigationPackage.MD](Domain/NavigationPackage.MD) and [Resources/SamplePackages.MD](Resources/SamplePackages.MD) to learn the app’s core value types and fixture data.
3. Continue with [Presentation/PackageList/PackageListView.MD](Presentation/PackageList/PackageListView.MD) and [Presentation/PackageList/PackageListViewModel.MD](Presentation/PackageList/PackageListViewModel.MD), because they show the most important SwiftUI and app-state patterns used elsewhere.
4. Then read the detail and history files for smaller examples of view/view-model separation.
5. Finish with the service and bridge files, which contain the densest Swift-specific material: existentials, async/await, actors, DTO mapping, and UIKit bridging.

## App
- [App/AeroNavCompanionApp.MD](App/AeroNavCompanionApp.MD) — App startup, the `App` protocol, `@main`, and `some Scene`.

## Domain
- [Domain/NavigationPackage.MD](Domain/NavigationPackage.MD) — Shared value models, enum raw values, identity, and concurrency-safe data shapes.

## Persistence
- [Persistence/ValidationHistoryStoring.MD](Persistence/ValidationHistoryStoring.MD) — `async throws` protocols, actor isolation, schema envelopes, and atomic JSON persistence.

## Presentation
- [Presentation/PackageList/PackageListView.MD](Presentation/PackageList/PackageListView.MD) — The home screen, property wrappers, bindings, result builders, and SwiftUI modifier composition.
- [Presentation/PackageList/PackageListViewModel.MD](Presentation/PackageList/PackageListViewModel.MD) — Published state, explicit existential dependencies, async imports, and history recording.
- [Presentation/PackageDetails/PackageDetailsView.MD](Presentation/PackageDetails/PackageDetailsView.MD) — Detail rendering with sectioned metadata and nested `ForEach` usage.
- [Presentation/PackageDetails/PackageDetailsViewModel.MD](Presentation/PackageDetails/PackageDetailsViewModel.MD) — Key-path grouping, computed properties, and reusable static formatters.
- [Presentation/History/HistoryView.MD](Presentation/History/HistoryView.MD) — Async loading on appearance and rendering enum-backed UI states.
- [Presentation/Diagnostics/DiagnosticsView.MD](Presentation/Diagnostics/DiagnosticsView.MD) — Protocol-based importing, tuple key paths, and grouped issue rendering.
- [Presentation/Bridge/CompanionBridgeView.MD](Presentation/Bridge/CompanionBridgeView.MD) — `ObservableObject`, QR scanning, UIKit bridging, and compact-summary decoding.

## Resources
- [Resources/SamplePackages.MD](Resources/SamplePackages.MD) — Sample fixture construction, static helpers, and date-building utilities.

## Services
- [Services/ManifestLoading.MD](Services/ManifestLoading.MD) — Security-scoped file access, `defer`, and detached file I/O.
- [Services/ManifestImportService.MD](Services/ManifestImportService.MD) — DTO decoding, validation rules, regex use, async service boundaries, and domain mapping.
- [Services/DiagnosticsImportService.MD](Services/DiagnosticsImportService.MD) — Nested report schema types and diagnostics JSON decoding.

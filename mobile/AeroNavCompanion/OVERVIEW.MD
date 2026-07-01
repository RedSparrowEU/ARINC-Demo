# AeroNavCompanion Source Overview

## Purpose
This folder contains the source of the iOS AeroNav Companion app. The app is a non-operational mobile companion that lets an operator inspect package manifests, review validation history, open desktop diagnostics reports, and optionally read compact diagnostics summaries from text or QR codes.

## Folder Structure
- `App/` contains the SwiftUI application entry point.
- `Domain/` contains lightweight shared product models such as a navigation package and its status.
- `Persistence/` contains storage contracts and the JSON-backed validation history store.
- `Presentation/` contains SwiftUI screens and view models for the list, details, history, diagnostics, and bridge flows.
- `Resources/` contains generated sample data used to populate the app before user imports.
- `Services/` contains file-loading and JSON-import logic for manifests and diagnostics reports.

## Main Runtime Flow
1. `App/AeroNavCompanionApp.swift` launches the SwiftUI app and shows the package list.
2. `Presentation/PackageList` shows built-in sample packages and exposes toolbar actions for import, history, diagnostics, and bridge reading.
3. `Services/ManifestImportService.swift` validates imported manifest JSON and converts it into `Domain/NavigationPackage` values.
4. `Persistence/ValidationHistoryStoring.swift` records import attempts so `Presentation/History` can show them later.
5. `Services/DiagnosticsImportService.swift` reads desktop diagnostics reports so `Presentation/Diagnostics` can display grouped issues.
6. `Presentation/Bridge/CompanionBridgeView.swift` optionally decodes compact summaries entered manually or scanned from QR codes.

## Recommended Reading Order
1. Start with [App/AeroNavCompanionApp.MD](App/AeroNavCompanionApp.MD) to see how the app launches.
2. Read [Domain/NavigationPackage.MD](Domain/NavigationPackage.MD) and [Resources/SamplePackages.MD](Resources/SamplePackages.MD) to understand the data shown on screen.
3. Continue with [Presentation/PackageList/PackageListView.MD](Presentation/PackageList/PackageListView.MD) and [Presentation/PackageList/PackageListViewModel.MD](Presentation/PackageList/PackageListViewModel.MD) to understand the home screen.
4. Then read the details and history files to see simpler screen/view-model patterns.
5. Finish with the service and bridge files, which contain more advanced Swift topics such as async work, protocols, actors, decoding, and UIKit bridging.

## App
- [App/AeroNavCompanionApp.MD](App/AeroNavCompanionApp.MD) — Explains the SwiftUI app entry point and how the home screen is chosen at launch.

## Domain
- [Domain/NavigationPackage.MD](Domain/NavigationPackage.MD) — Explains the core package, status, file, and grouped-file models shared across the app.

## Persistence
- [Persistence/ValidationHistoryStoring.MD](Persistence/ValidationHistoryStoring.MD) — Explains the history record model, the storage protocol, and the actor-backed JSON history store.

## Presentation
- [Presentation/PackageList/PackageListView.MD](Presentation/PackageList/PackageListView.MD) — Explains the main package list UI, toolbar actions, sheet presentation, and the import banner.
- [Presentation/PackageList/PackageListViewModel.MD](Presentation/PackageList/PackageListViewModel.MD) — Explains how the home screen manages packages, import state, and history writes.
- [Presentation/PackageDetails/PackageDetailsView.MD](Presentation/PackageDetails/PackageDetailsView.MD) — Explains how one package is rendered as status, metadata, and grouped file sections.
- [Presentation/PackageDetails/PackageDetailsViewModel.MD](Presentation/PackageDetails/PackageDetailsViewModel.MD) — Explains the grouping and date-formatting logic prepared for the details screen.
- [Presentation/History/HistoryView.MD](Presentation/History/HistoryView.MD) — Explains how stored import attempts are loaded and shown in the validation history sheet.
- [Presentation/Diagnostics/DiagnosticsView.MD](Presentation/Diagnostics/DiagnosticsView.MD) — Explains the diagnostics sheet, import flow, and severity-group rendering.
- [Presentation/Bridge/CompanionBridgeView.MD](Presentation/Bridge/CompanionBridgeView.MD) — Explains the compact text/QR bridge, its codec, and the VisionKit scanner wrapper.

## Resources
- [Resources/SamplePackages.MD](Resources/SamplePackages.MD) — Explains the generated demo package data used before any operator import occurs.

## Services
- [Services/ManifestLoading.MD](Services/ManifestLoading.MD) — Explains secure file access and background reading for picked documents.
- [Services/ManifestImportService.MD](Services/ManifestImportService.MD) — Explains manifest decoding, mobile validation rules, and status classification.
- [Services/DiagnosticsImportService.MD](Services/DiagnosticsImportService.MD) — Explains diagnostics-report decoding and schema-version checking.

# CompanionBridgeView.swift

Source: `Presentation/Bridge/CompanionBridgeView.swift`

## Purpose
Implements the optional companion bridge that reads a compact diagnostics payload from text or QR code and shows a summary.

## Architecture Role
Presentation layer plus a UIKit bridge for VisionKit scanning.

## App Flow Context
The package list opens this sheet, the view model decodes an `AERONAV1` payload, and the scanner wrapper feeds recognized QR values into the same decode path.

## Swift Concepts To Notice
- `ObservableObject` + `@Published`: This is the standard SwiftUI view-model pattern: a reference type exposes mutable state, and property-wrapper-marked fields trigger view refreshes when they change.
- `@MainActor`: Pins the view model to the main actor so UI-facing state changes happen on the same actor SwiftUI expects.
- `@StateObject`, `@State`, and `@Environment`: These property wrappers model three different ownership rules: owned observable object, local mutable view state, and values injected by the SwiftUI environment.
- `some View`: Opaque return type for a SwiftUI view body. The compiler still knows the exact concrete type, but callers only depend on the `View` protocol.
- `UIViewControllerRepresentable` + `Coordinator`: This is the standard bridge when SwiftUI needs to host a UIKit controller and receive delegate callbacks.
- `@escaping` closures: The scanner stores the callback to run later, so Swift requires the closure parameter to be marked as escaping.

## Semantic Walkthrough
- Lines 1-2: Import SwiftUI for the sheet UI and VisionKit for `DataScannerViewController`, which does the QR recognition work on supported devices.
- Line 4: Define `CompactDiagnosticsSummary` as the typed payload produced by the bridge. `Codable` is important here because the summary is reconstructed from JSON after base64 decoding.
- Line 5: Use an `enum` as a namespace for codec logic. Swift enums without instance cases are often used this way instead of creating a class with only static helpers. The `decode` function also shows `.self`, which is how Swift refers to a type object when passing it into generic APIs like `JSONDecoder.decode`.
- Line 6: Define `CompanionBridgeViewModel` as a main-actor `ObservableObject`. The `@Published` fields drive the sheet UI, the defaulted parameter `read(_ value: String? = nil)` demonstrates optional parameters with defaults, and the `do`/`catch` block turns Swift errors into display state rather than throwing back into the view layer.
- Line 7: Build the SwiftUI sheet. This single line combines several SwiftUI-specific ideas: property-wrapper state ownership, a computed `scannerAvailable` property, `body: some View`, bindings like `$viewModel.text` and `$scanning`, optional binding with `if let`, and long modifier chains such as `.navigationTitle(...).toolbar(...).sheet(...)`. The important app behavior is that manual entry and QR scanning both feed the same view model instead of creating separate parsing code paths.
- Line 8: Bridge into UIKit with `UIViewControllerRepresentable`. `makeCoordinator()` installs a delegate object, `makeUIViewController` creates the scanner and starts it with `try?` because failure is non-fatal UI setup here, and the nested `Coordinator` uses an `@escaping` callback plus `if case let` pattern matching to accept the first QR payload and stop scanning.

## Why This File Matters
Implements the optional companion bridge that reads a compact diagnostics payload from text or QR code and shows a summary.

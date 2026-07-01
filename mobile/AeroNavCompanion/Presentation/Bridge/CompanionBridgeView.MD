# CompanionBridgeView.swift

Source: `Presentation/Bridge/CompanionBridgeView.swift`

## Purpose
This file implements the optional compact diagnostics bridge. It lets the operator paste or scan a compact `AERONAV1` payload and view a summary.

## Architecture Role
Presentation layer with a small decoding helper. It owns the SwiftUI sheet, its state object, and the UIKit bridge needed for VisionKit QR scanning.

## App Flow Context
The package list opens this sheet, the view model decodes manual text or scanned QR content, and the UI renders either a compact summary or an error message.

## Line-by-Line Explanation
- Line 1: `import SwiftUI` Imports the SwiftUI framework, which provides declarative UI types like `View`, `NavigationStack`, `List`, and property wrappers such as `@StateObject`.
- Line 2: `import VisionKit` Imports VisionKit so the app can use Apple’s built-in data scanner for QR recognition on supported devices.
- Line 3: `<blank>` Blank line used only for visual separation between related pieces of code.
- Line 4: `struct CompactDiagnosticsSummary: Codable, Equatable, Sendable {` Declares the Swift `struct` named `CompactDiagnosticsSummary`. Structs are value types, which makes them a common fit for data models and SwiftUI views.
- Line 5: `let packageId, status, generatedAt, summary: String` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 6: `let blocking, warning: Int` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 7: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 8: `enum CompactSummaryCodec {` Declares the enum `CompactSummaryCodec`. Enums model a fixed set of cases, which is useful for statuses and UI states.
- Line 9: `static let prefix = "AERONAV1:"` The source on this line is `static let prefix = "AERONAV1:"`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 10: `static func decode(_ text: String) throws -> CompactDiagnosticsSummary {` Declares the static decode function used to turn a compact bridge string into a typed diagnostics summary.
- Line 11: `guard text.hasPrefix(prefix) else {` Starts a `guard` statement. Swift uses `guard` for required preconditions and exits early if the condition is not satisfied.
- Line 12: `throw CocoaError(.fileReadCorruptFile)` Throws an error. That stops normal execution here and hands the failure to the nearest caller that handles errors.
- Line 13: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 14: `var value = String(text.dropFirst(prefix.count)).replacingOccurrences(` Declares a `var` property. `var` means the value may change later, or at least is not guaranteed to stay constant.
- Line 15: `of: "-",` The source on this line is `of: "-",`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 16: `with: "+"` The source on this line is `with: "+"`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 17: `).replacingOccurrences(of: "_", with: "/")` The source on this line is `).replacingOccurrences(of: "_", with: "/")`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 18: `value += String(repeating: "=", count: (4 - value.count % 4) % 4)` The source on this line is `value += String(repeating: "=", count: (4 - value.count % 4) % 4)`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 19: `guard let data = Data(base64Encoded: value) else {` Starts a `guard` statement. Swift uses `guard` for required preconditions and exits early if the condition is not satisfied.
- Line 20: `throw CocoaError(.fileReadCorruptFile)` Throws an error. That stops normal execution here and hands the failure to the nearest caller that handles errors.
- Line 21: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 22: `return try JSONDecoder().decode(` Returns a value from the current function or computed property.
- Line 23: `CompactDiagnosticsSummary.self,` The source on this line is `CompactDiagnosticsSummary.self,`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 24: `from: data` The source on this line is `from: data`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 25: `)` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 26: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 27: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 28: `@MainActor final class CompanionBridgeViewModel: ObservableObject {` The source on this line is `@MainActor final class CompanionBridgeViewModel: ObservableObject {`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 29: `@Published var text = ""` `@Published` marks observable state. When this property changes, SwiftUI views watching the object know they may need to redraw.
- Line 30: `@Published var summary: CompactDiagnosticsSummary?` `@Published` marks observable state. When this property changes, SwiftUI views watching the object know they may need to redraw.
- Line 31: `@Published var error: String?` `@Published` marks observable state. When this property changes, SwiftUI views watching the object know they may need to redraw.
- Line 32: `func read(_ value: String? = nil) {` Starts the function `read`. Functions group behavior into a reusable named operation.
- Line 33: `do {` Starts a `do` block so the code inside can call throwing operations and pair them with `catch` handling.
- Line 34: `summary = try CompactSummaryCodec.decode(value ?? text)` The source on this line is `summary = try CompactSummaryCodec.decode(value ?? text)`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 35: `error = nil` The source on this line is `error = nil`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 36: `} catch {` Handles any error thrown by the preceding `do` block.
- Line 37: `summary = nil` The source on this line is `summary = nil`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 38: `self.error = "Invalid or unsupported compact diagnostics summary."` The source on this line is `self.error = "Invalid or unsupported compact diagnostics summary."`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 39: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 40: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 41: `func acceptScannedValue(_ value: String) {` Starts the function `acceptScannedValue`. Functions group behavior into a reusable named operation.
- Line 42: `text = value` The source on this line is `text = value`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 43: `read(value)` The source on this line is `read(value)`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 44: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 45: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 46: `struct CompanionBridgeView: View {` Declares the Swift `struct` named `CompanionBridgeView`. Structs are value types, which makes them a common fit for data models and SwiftUI views.
- Line 47: `@Environment(\.dismiss) private var dismiss` Reads a value supplied by the surrounding SwiftUI environment. Here it pulls in the dismiss action for closing a sheet.
- Line 48: `@StateObject var viewModel = CompanionBridgeViewModel()` `@StateObject` tells SwiftUI that this view owns a long-lived observable reference object and should preserve it across body recalculations.
- Line 49: `@State private var scanning = false` `@State` stores view-local mutable state. SwiftUI keeps the value alive even though the view struct itself is recreated often.
- Line 50: `private var scannerAvailable: Bool {` The source on this line is `private var scannerAvailable: Bool {`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 51: `DataScannerViewController.isSupported` The source on this line is `DataScannerViewController.isSupported`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 52: `&& DataScannerViewController.isAvailable` The source on this line is `&& DataScannerViewController.isAvailable`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 53: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 54: `var body: some View {` Starts a computed property. Swift runs the enclosed code each time the property is read instead of storing a separate value.
- Line 55: `NavigationStack {` Starts a SwiftUI navigation container. It enables titles and push-style navigation to child screens.
- Line 56: `Form {` Starts a SwiftUI form, which is similar to a list but is commonly used for grouped controls and settings-style content.
- Line 57: `Section("Optional text bridge") {` Starts a grouped section inside a SwiftUI list or form so related rows are visually organized.
- Line 58: `TextField(` Creates an editable text field and binds its contents to Swift state.
- Line 59: `"AERONAV1:…",` The source on this line is `"AERONAV1:…",`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 60: `text: $viewModel.text,` The source on this line is `text: $viewModel.text,`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 61: `axis: .vertical` The source on this line is `axis: .vertical`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 62: `)` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 63: `Button("Read summary") { viewModel.read() }` Creates a SwiftUI button. The attached closure is the action that runs when the operator taps it.
- Line 64: `Button("Scan QR code", systemImage: "qrcode.viewfinder") {` Creates a SwiftUI button. The attached closure is the action that runs when the operator taps it.
- Line 65: `scanning = true` The source on this line is `scanning = true`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 66: `}.disabled(!scannerAvailable)` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 67: `if !scannerAvailable {` Starts an `if` condition. The following block runs only when the condition evaluates to true.
- Line 68: `Text(` Creates a SwiftUI text view that displays a string on screen.
- Line 69: `"QR scanning requires a supported physical device with camera access."` The source on this line is `"QR scanning requires a supported physical device with camera access."`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 70: `).font(.caption).foregroundStyle(.secondary)` The source on this line is `).font(.caption).foregroundStyle(.secondary)`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 71: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 72: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 73: `if let summary = viewModel.summary {` Starts an `if` condition. The following block runs only when the condition evaluates to true.
- Line 74: `Section("Summary") {` Starts a grouped section inside a SwiftUI list or form so related rows are visually organized.
- Line 75: `LabeledContent("Package", value: summary.packageId)` Creates a label-value row, which is a concise SwiftUI way to display package metadata.
- Line 76: `LabeledContent("Status", value: summary.status)` Creates a label-value row, which is a concise SwiftUI way to display package metadata.
- Line 77: `LabeledContent("Blocking", value: "\(summary.blocking)")` Creates a label-value row, which is a concise SwiftUI way to display package metadata.
- Line 78: `LabeledContent("Warnings", value: "\(summary.warning)")` Creates a label-value row, which is a concise SwiftUI way to display package metadata.
- Line 79: `Text(summary.summary)` Creates a SwiftUI text view that displays a string on screen.
- Line 80: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 81: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 82: `if let error = viewModel.error {` Starts an `if` condition. The following block runs only when the condition evaluates to true.
- Line 83: `Section { Text(error).foregroundStyle(.red) }` The source on this line is `Section { Text(error).foregroundStyle(.red) }`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 84: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 85: `Section {` Starts a grouped section inside a SwiftUI list or form so related rows are visually organized.
- Line 86: `Text(` Creates a SwiftUI text view that displays a string on screen.
- Line 87: `"NON-OPERATIONAL DEMO — compact summaries do not replace the full diagnostics report."` This line continues the surrounding Swift statement with additional arguments, data, or formatting.
- Line 88: `).font(.caption)` The source on this line is `).font(.caption)`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 89: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 90: `}.navigationTitle("Companion Bridge").toolbar {` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 91: `ToolbarItem(placement: .topBarTrailing) {` The source on this line is `ToolbarItem(placement: .topBarTrailing) {`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 92: `Button("Close", systemImage: "xmark") { dismiss() }` Creates a SwiftUI button. The attached closure is the action that runs when the operator taps it.
- Line 93: `.buttonStyle(.bordered).buttonBorderShape(.circle)` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 94: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 95: `}.sheet(isPresented: $scanning) {` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 96: `QRScanner { value in` The source on this line is `QRScanner { value in`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 97: `viewModel.acceptScannedValue(value)` The source on this line is `viewModel.acceptScannedValue(value)`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 98: `scanning = false` The source on this line is `scanning = false`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 99: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 100: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 101: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 102: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 103: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 104: `struct QRScanner: UIViewControllerRepresentable {` Declares the Swift `struct` named `QRScanner`. Structs are value types, which makes them a common fit for data models and SwiftUI views.
- Line 105: `let found: (String) -> Void` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 106: `func makeCoordinator() -> Coordinator { Coordinator(found) }` Starts the function `makeCoordinator`. Functions group behavior into a reusable named operation.
- Line 107: `func makeUIViewController(context: Context) -> DataScannerViewController {` Starts the function `makeUIViewController`. Functions group behavior into a reusable named operation.
- Line 108: `let controller = DataScannerViewController(recognizedDataTypes: [` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 109: `.barcode(symbologies: [.qr])` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 110: `])` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 111: `controller.delegate = context.coordinator` The source on this line is `controller.delegate = context.coordinator`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 112: `try? controller.startScanning()` The source on this line is `try? controller.startScanning()`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 113: `return controller` Returns a value from the current function or computed property.
- Line 114: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 115: `func updateUIViewController(` Starts the function `updateUIViewController`. Functions group behavior into a reusable named operation.
- Line 116: `_ uiViewController: DataScannerViewController,` The source on this line is `_ uiViewController: DataScannerViewController,`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 117: `context: Context` The source on this line is `context: Context`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 118: `) {}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 119: `final class Coordinator: NSObject, DataScannerViewControllerDelegate {` Defines the nested coordinator class required by `UIViewControllerRepresentable`. In SwiftUI-to-UIKit bridges, a coordinator is where delegate callbacks are usually handled.
- Line 120: `let found: (String) -> Void` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 121: `private var accepted = false` The source on this line is `private var accepted = false`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 122: `init(_ found: @escaping (String) -> Void) { self.found = found }` Starts an initializer. `init` is Swift’s constructor and is responsible for preparing a new instance with valid stored properties.
- Line 123: `func dataScanner(` Starts the function `dataScanner`. Functions group behavior into a reusable named operation.
- Line 124: `_ dataScanner: DataScannerViewController,` The source on this line is `_ dataScanner: DataScannerViewController,`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 125: `didAdd addedItems: [RecognizedItem],` The source on this line is `didAdd addedItems: [RecognizedItem],`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 126: `allItems: [RecognizedItem]` The source on this line is `allItems: [RecognizedItem]`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 127: `) {` The source on this line is `) {`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 128: `guard !accepted else { return }` Starts a `guard` statement. Swift uses `guard` for required preconditions and exits early if the condition is not satisfied.
- Line 129: `for item in addedItems {` Starts a loop that repeats the enclosed block for each item in a collection.
- Line 130: `if case .barcode(let code) = item,` Starts an `if` condition. The following block runs only when the condition evaluates to true.
- Line 131: `let value = code.payloadStringValue` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 132: `{` Opens a new Swift scope, so the following indented lines belong to the declaration or control-flow block above.
- Line 133: `accepted = true` The source on this line is `accepted = true`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 134: `dataScanner.stopScanning()` The source on this line is `dataScanner.stopScanning()`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 135: `found(value)` The source on this line is `found(value)`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 136: `return` Returns immediately from the current function.
- Line 137: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 138: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 139: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 140: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 141: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.

## Why This File Matters
This file implements the optional compact diagnostics bridge. It lets the operator paste or scan a compact `AERONAV1` payload and view a summary.

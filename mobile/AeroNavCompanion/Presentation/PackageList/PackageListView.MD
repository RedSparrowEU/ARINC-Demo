# PackageListView.swift

Source: `Presentation/PackageList/PackageListView.swift`

## Purpose
This file defines the main home screen of the mobile app: the package list, the toolbar actions, the import banner, and the demo disclaimer.

## Architecture Role
Presentation layer. It owns UI-only state for sheets and import presentation while delegating business work to `PackageListViewModel`.

## App Flow Context
The app launches into this view, which lists packages, opens details, starts manifest import, and presents the history, diagnostics, and bridge sheets.

## Line-by-Line Explanation
- Line 1: `import SwiftUI` Imports the SwiftUI framework, which provides declarative UI types like `View`, `NavigationStack`, `List`, and property wrappers such as `@StateObject`.
- Line 2: `import UniformTypeIdentifiers` Imports Uniform Type Identifiers so the file importer can declare that it accepts JSON files.
- Line 3: `<blank>` Blank line used only for visual separation between related pieces of code.
- Line 4: `struct PackageListView: View {` Declares the Swift `struct` named `PackageListView`. Structs are value types, which makes them a common fit for data models and SwiftUI views.
- Line 5: `@StateObject private var viewModel: PackageListViewModel` `@StateObject` tells SwiftUI that this view owns a long-lived observable reference object and should preserve it across body recalculations.
- Line 6: `@State private var importing = false` `@State` stores view-local mutable state. SwiftUI keeps the value alive even though the view struct itself is recreated often.
- Line 7: `@State private var showingHistory = false` `@State` stores view-local mutable state. SwiftUI keeps the value alive even though the view struct itself is recreated often.
- Line 8: `@State private var showingDiagnostics = false` `@State` stores view-local mutable state. SwiftUI keeps the value alive even though the view struct itself is recreated often.
- Line 9: `@State private var showingBridge = false` `@State` stores view-local mutable state. SwiftUI keeps the value alive even though the view struct itself is recreated often.
- Line 10: `<blank>` Blank line used only for visual separation between related pieces of code.
- Line 11: `init(viewModel: PackageListViewModel) {` Starts an initializer. `init` is Swift’s constructor and is responsible for preparing a new instance with valid stored properties.
- Line 12: `_viewModel = StateObject(wrappedValue: viewModel)` The source on this line is `_viewModel = StateObject(wrappedValue: viewModel)`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 13: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 14: `<blank>` Blank line used only for visual separation between related pieces of code.
- Line 15: `var body: some View {` Starts a computed property. Swift runs the enclosed code each time the property is read instead of storing a separate value.
- Line 16: `NavigationStack {` Starts a SwiftUI navigation container. It enables titles and push-style navigation to child screens.
- Line 17: `List(viewModel.packages) { package in` Starts a SwiftUI list, which is the standard scrolling row-based container in many iOS apps.
- Line 18: `NavigationLink {` The source on this line is `NavigationLink {`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 19: `PackageDetailsView(viewModel: PackageDetailsViewModel(package: package))` This line continues the surrounding Swift statement with additional arguments, data, or formatting.
- Line 20: `} label: {` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 21: `PackageRow(package: package)` The source on this line is `PackageRow(package: package)`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 22: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 23: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 24: `.navigationTitle("AeroNav Companion")` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 25: `.toolbar { Button("Bridge",systemImage:"qrcode.viewfinder"){showingBridge=true};Button("Diagnostics",systemImage:"stethoscope"){showingDiagnostics=true};Button("History",systemImage:"clock"){showingHistory=true}; Button("Import manifest", systemImage:"square.and.arrow.down") { importing=true } }` Adds the toolbar for the home screen. Several button declarations are compressed onto one source line, but together they expose the Bridge, Diagnostics, History, and Import actions.
- Line 26: `.sheet(isPresented:$showingBridge){CompanionBridgeView()}` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 27: `.sheet(isPresented:$showingDiagnostics){DiagnosticsView()}` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 28: `.sheet(isPresented:$showingHistory){HistoryView(viewModel:HistoryViewModel(store:viewModel.historyStore))}` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 29: `.fileImporter(isPresented:$importing, allowedContentTypes:[.json]) { result in if case let .success(url)=result { Task { await viewModel.importManifest(from:url) } } }` Attaches the iOS file importer for JSON manifests. If the user picks a file successfully, the code launches an async task that asks the view model to import it.
- Line 30: `.safeAreaInset(edge:.top) { importBanner }` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 31: `.overlay {` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 32: `if viewModel.packages.isEmpty {` Starts an `if` condition. The following block runs only when the condition evaluates to true.
- Line 33: `ContentUnavailableView("No sample packages", systemImage: "shippingbox")` Creates Apple’s standard empty-state or error-state view with a title, system symbol, and optional description.
- Line 34: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 35: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 36: `.safeAreaInset(edge: .bottom) {` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 37: `Text("NON-OPERATIONAL DEMO")` Creates a SwiftUI text view that displays a string on screen.
- Line 38: `.font(.caption2.weight(.bold))` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 39: `.tracking(1.2)` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 40: `.frame(maxWidth: .infinity)` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 41: `.padding(10)` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 42: `.background(.ultraThinMaterial)` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 43: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 44: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 45: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 46: `@ViewBuilder private var importBanner: some View { switch viewModel.importState { case .idle: EmptyView(); case .loading: ProgressView("Importing manifest…").padding(); case .failure(let message): Text(message).foregroundStyle(.red).padding(); case .result(let result): VStack { Text("Import \(result.status?.rawValue ?? "failed")").font(.headline); ForEach(result.issues){Text($0.message).font(.caption)} }.padding().frame(maxWidth:.infinity).background(.thinMaterial) } }` Defines the computed banner view. `@ViewBuilder` allows this one property to return different UI for idle, loading, failure, and validation-result states.
- Line 47: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 48: `<blank>` Blank line used only for visual separation between related pieces of code.
- Line 49: `private struct PackageRow: View {` The source on this line is `private struct PackageRow: View {`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 50: `let package: NavigationPackage` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 51: `<blank>` Blank line used only for visual separation between related pieces of code.
- Line 52: `var body: some View {` Starts a computed property. Swift runs the enclosed code each time the property is read instead of storing a separate value.
- Line 53: `VStack(alignment: .leading, spacing: 8) {` The source on this line is `VStack(alignment: .leading, spacing: 8) {`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 54: `HStack(alignment: .firstTextBaseline) {` The source on this line is `HStack(alignment: .firstTextBaseline) {`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 55: `Text(package.id).font(.headline)` Creates a SwiftUI text view that displays a string on screen.
- Line 56: `Spacer()` The source on this line is `Spacer()`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 57: `StatusBadge(status: package.status)` The source on this line is `StatusBadge(status: package.status)`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 58: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 59: `Text("Cycle \(package.cycle) · \(package.region)")` Creates a SwiftUI text view that displays a string on screen.
- Line 60: `.font(.subheadline)` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 61: `.foregroundStyle(.secondary)` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 62: `Text(package.targetDevice)` Creates a SwiftUI text view that displays a string on screen.
- Line 63: `.font(.caption)` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 64: `.foregroundStyle(.secondary)` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 65: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 66: `.padding(.vertical, 5)` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 67: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 68: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 69: `<blank>` Blank line used only for visual separation between related pieces of code.
- Line 70: `struct StatusBadge: View {` Declares the Swift `struct` named `StatusBadge`. Structs are value types, which makes them a common fit for data models and SwiftUI views.
- Line 71: `let status: PackageStatus` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 72: `<blank>` Blank line used only for visual separation between related pieces of code.
- Line 73: `var body: some View {` Starts a computed property. Swift runs the enclosed code each time the property is read instead of storing a separate value.
- Line 74: `Text(status.rawValue)` Creates a SwiftUI text view that displays a string on screen.
- Line 75: `.font(.caption2.weight(.bold))` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 76: `.foregroundStyle(color)` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 77: `.padding(.horizontal, 8)` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 78: `.padding(.vertical, 4)` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 79: `.background(color.opacity(0.15), in: Capsule())` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 80: `.accessibilityLabel("Package status: \(status.rawValue)")` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 81: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 82: `<blank>` Blank line used only for visual separation between related pieces of code.
- Line 83: `private var color: Color {` The source on this line is `private var color: Color {`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 84: `switch status {` Starts a `switch`, which matches one value against several cases in a structured and readable way.
- Line 85: `case .valid: .green` Declares one enum case, meaning one allowed named value inside the surrounding enum.
- Line 86: `case .warning: .orange` Declares one enum case, meaning one allowed named value inside the surrounding enum.
- Line 87: `case .failed: .red` Declares one enum case, meaning one allowed named value inside the surrounding enum.
- Line 88: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 89: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 90: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 91: `<blank>` Blank line used only for visual separation between related pieces of code.
- Line 92: `#Preview {` Starts an Xcode preview block. Preview code exists for development-time visualization and is not part of production runtime behavior.
- Line 93: `PackageListView(viewModel: PackageListViewModel())` The source on this line is `PackageListView(viewModel: PackageListViewModel())`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 94: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.

## Why This File Matters
This file defines the main home screen of the mobile app: the package list, the toolbar actions, the import banner, and the demo disclaimer.

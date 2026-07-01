# DiagnosticsView.swift

Source: `Presentation/Diagnostics/DiagnosticsView.swift`

## Purpose
This file implements the diagnostics-review sheet for importing a desktop diagnostics report and showing issues grouped by severity.

## Architecture Role
Presentation layer. The view model coordinates asynchronous loading and the view renders idle, loading, failure, or loaded states.

## App Flow Context
The list screen presents this sheet, the user chooses a JSON report, the importer decodes it, and the view groups issues into readable sections.

## Line-by-Line Explanation
- Line 1: `import SwiftUI` Imports the SwiftUI framework, which provides declarative UI types like `View`, `NavigationStack`, `List`, and property wrappers such as `@StateObject`.
- Line 2: `<blank>` Blank line used only for visual separation between related pieces of code.
- Line 3: `@MainActor final class DiagnosticsViewModel: ObservableObject {` The source on this line is `@MainActor final class DiagnosticsViewModel: ObservableObject {`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 4: `enum State {` Declares the enum `State`. Enums model a fixed set of cases, which is useful for statuses and UI states.
- Line 5: `case idle, loading` Declares one enum case, meaning one allowed named value inside the surrounding enum.
- Line 6: `case loaded(DiagnosticsReport)` Declares one enum case, meaning one allowed named value inside the surrounding enum.
- Line 7: `case failure(String)` Declares one enum case, meaning one allowed named value inside the surrounding enum.
- Line 8: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 9: `@Published var state: State = .idle` `@Published` marks observable state. When this property changes, SwiftUI views watching the object know they may need to redraw.
- Line 10: `let importer: any DiagnosticsImporting` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 11: `init(importer: any DiagnosticsImporting = DiagnosticsImportService()) {` Starts an initializer. `init` is Swift’s constructor and is responsible for preparing a new instance with valid stored properties.
- Line 12: `self.importer = importer` The source on this line is `self.importer = importer`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 13: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 14: `func load(_ url: URL) async {` Starts the function `load`. Functions group behavior into a reusable named operation.
- Line 15: `state = .loading` The source on this line is `state = .loading`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 16: `do { state = .loaded(try await importer.load(from: url)) } catch {` Starts a `do` block so the code inside can call throwing operations and pair them with `catch` handling.
- Line 17: `state = .failure(error.localizedDescription)` The source on this line is `state = .failure(error.localizedDescription)`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 18: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 19: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 20: `func groups(_ report: DiagnosticsReport) -> [(` Starts the function `groups`. Functions group behavior into a reusable named operation.
- Line 21: `String, [DiagnosticsReport.Issue]` The source on this line is `String, [DiagnosticsReport.Issue]`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 22: `)] {` The source on this line is `)] {`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 23: `["blocking", "error", "warning", "info"].compactMap { severity in` The source on this line is `["blocking", "error", "warning", "info"].compactMap { severity in`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 24: `let values = report.issues.filter { $0.severity == severity }` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 25: `return values.isEmpty ? nil : (severity, values)` Returns a value from the current function or computed property.
- Line 26: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 27: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 28: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 29: `struct DiagnosticsView: View {` Declares the Swift `struct` named `DiagnosticsView`. Structs are value types, which makes them a common fit for data models and SwiftUI views.
- Line 30: `@Environment(\.dismiss) private var dismiss` Reads a value supplied by the surrounding SwiftUI environment. Here it pulls in the dismiss action for closing a sheet.
- Line 31: `@StateObject var viewModel = DiagnosticsViewModel()` `@StateObject` tells SwiftUI that this view owns a long-lived observable reference object and should preserve it across body recalculations.
- Line 32: `@State private var importing = false` `@State` stores view-local mutable state. SwiftUI keeps the value alive even though the view struct itself is recreated often.
- Line 33: `var body: some View {` Starts a computed property. Swift runs the enclosed code each time the property is read instead of storing a separate value.
- Line 34: `NavigationStack {` Starts a SwiftUI navigation container. It enables titles and push-style navigation to child screens.
- Line 35: `Group {` Starts a SwiftUI `Group`, which lets related view-building code be organized without adding a visible container to the layout.
- Line 36: `switch viewModel.state {` Starts a `switch`, which matches one value against several cases in a structured and readable way.
- Line 37: `case .idle:` Declares one enum case, meaning one allowed named value inside the surrounding enum.
- Line 38: `ContentUnavailableView(` Creates Apple’s standard empty-state or error-state view with a title, system symbol, and optional description.
- Line 39: `"No diagnostics report",` The source on this line is `"No diagnostics report",`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 40: `systemImage: "stethoscope"` The source on this line is `systemImage: "stethoscope"`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 41: `)` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 42: `case .loading: ProgressView()` Declares one enum case, meaning one allowed named value inside the surrounding enum.
- Line 43: `case .failure(let message):` Declares one enum case, meaning one allowed named value inside the surrounding enum.
- Line 44: `ContentUnavailableView(` Creates Apple’s standard empty-state or error-state view with a title, system symbol, and optional description.
- Line 45: `"Invalid report",` The source on this line is `"Invalid report",`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 46: `systemImage: "exclamationmark.triangle",` The source on this line is `systemImage: "exclamationmark.triangle",`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 47: `description: Text(message)` The source on this line is `description: Text(message)`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 48: `)` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 49: `case .loaded(let report):` Declares one enum case, meaning one allowed named value inside the surrounding enum.
- Line 50: `List {` Starts a SwiftUI list, which is the standard scrolling row-based container in many iOS apps.
- Line 51: `Section("Report") {` Starts a grouped section inside a SwiftUI list or form so related rows are visually organized.
- Line 52: `Text(report.package.packageId)` Creates a SwiftUI text view that displays a string on screen.
- Line 53: `Text(` Creates a SwiftUI text view that displays a string on screen.
- Line 54: `"\(report.operation.type) · \(report.operation.status)"` The source on this line is `"\(report.operation.type) · \(report.operation.status)"`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 55: `)` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 56: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 57: `ForEach(viewModel.groups(report), id: \.0) { group in` Starts a SwiftUI `ForEach`, which repeats child views for each element of some data collection.
- Line 58: `Section(group.0.capitalized) {` Starts a grouped section inside a SwiftUI list or form so related rows are visually organized.
- Line 59: `ForEach(group.1) { issue in` Starts a SwiftUI `ForEach`, which repeats child views for each element of some data collection.
- Line 60: `VStack(alignment: .leading) {` The source on this line is `VStack(alignment: .leading) {`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 61: `Text(issue.message)` Creates a SwiftUI text view that displays a string on screen.
- Line 62: `Text(issue.suggestedAction).font(` Creates a SwiftUI text view that displays a string on screen.
- Line 63: `.caption` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 64: `).foregroundStyle(.secondary)` The source on this line is `).foregroundStyle(.secondary)`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 65: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 66: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 67: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 68: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 69: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 70: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 71: `}.navigationTitle("Diagnostics").toolbar {` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 72: `ToolbarItemGroup(placement: .topBarTrailing) {` The source on this line is `ToolbarItemGroup(placement: .topBarTrailing) {`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 73: `Button("Import", systemImage: "square.and.arrow.down") {` Creates a SwiftUI button. The attached closure is the action that runs when the operator taps it.
- Line 74: `importing = true` The source on this line is `importing = true`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 75: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 76: `Button("Close", systemImage: "xmark") { dismiss() }` Creates a SwiftUI button. The attached closure is the action that runs when the operator taps it.
- Line 77: `.buttonStyle(.bordered).buttonBorderShape(.circle)` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 78: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 79: `}.fileImporter(` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 80: `isPresented: $importing,` The source on this line is `isPresented: $importing,`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 81: `allowedContentTypes: [.json]` The source on this line is `allowedContentTypes: [.json]`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 82: `) { result in` The source on this line is `) { result in`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 83: `if case .success(let url) = result {` Starts an `if` condition. The following block runs only when the condition evaluates to true.
- Line 84: `Task { await viewModel.load(url) }` Starts a new asynchronous task from the UI layer so work can continue without blocking the current event callback.
- Line 85: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 86: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 87: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 88: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 89: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.

## Why This File Matters
This file implements the diagnostics-review sheet for importing a desktop diagnostics report and showing issues grouped by severity.

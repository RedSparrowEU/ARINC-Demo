# HistoryView.swift

Source: `Presentation/History/HistoryView.swift`

## Purpose
This file implements the validation history sheet that shows prior manifest import attempts stored on the device.

## Architecture Role
Presentation layer. The view model loads persistence data and the view turns that state into loading, empty, error, or list UI.

## App Flow Context
The list screen opens this sheet, the view model reads the JSON history store, and the view presents the newest validation attempts first.

## Line-by-Line Explanation
- Line 1: `import SwiftUI` Imports the SwiftUI framework, which provides declarative UI types like `View`, `NavigationStack`, `List`, and property wrappers such as `@StateObject`.
- Line 2: `<blank>` Blank line used only for visual separation between related pieces of code.
- Line 3: `@MainActor final class HistoryViewModel: ObservableObject {` The source on this line is `@MainActor final class HistoryViewModel: ObservableObject {`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 4: `enum State {` Declares the enum `State`. Enums model a fixed set of cases, which is useful for statuses and UI states.
- Line 5: `case loading, empty` Declares one enum case, meaning one allowed named value inside the surrounding enum.
- Line 6: `case loaded([ValidationHistoryRecord])` Declares one enum case, meaning one allowed named value inside the surrounding enum.
- Line 7: `case failure(String)` Declares one enum case, meaning one allowed named value inside the surrounding enum.
- Line 8: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 9: `@Published var state: State = .loading` `@Published` marks observable state. When this property changes, SwiftUI views watching the object know they may need to redraw.
- Line 10: `let store: any ValidationHistoryStoring` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 11: `init(store: any ValidationHistoryStoring) { self.store = store }` Starts an initializer. `init` is Swift’s constructor and is responsible for preparing a new instance with valid stored properties.
- Line 12: `func load() async {` Starts the function `load`. Functions group behavior into a reusable named operation.
- Line 13: `state = .loading` The source on this line is `state = .loading`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 14: `do {` Starts a `do` block so the code inside can call throwing operations and pair them with `catch` handling.
- Line 15: `let records = try await store.load()` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 16: `state = records.isEmpty ? .empty : .loaded(records)` The source on this line is `state = records.isEmpty ? .empty : .loaded(records)`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 17: `} catch { state = .failure(error.localizedDescription) }` Handles any error thrown by the preceding `do` block.
- Line 18: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 19: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 20: `struct HistoryView: View {` Declares the Swift `struct` named `HistoryView`. Structs are value types, which makes them a common fit for data models and SwiftUI views.
- Line 21: `@Environment(\.dismiss) private var dismiss` Reads a value supplied by the surrounding SwiftUI environment. Here it pulls in the dismiss action for closing a sheet.
- Line 22: `@StateObject var viewModel: HistoryViewModel` `@StateObject` tells SwiftUI that this view owns a long-lived observable reference object and should preserve it across body recalculations.
- Line 23: `var body: some View {` Starts a computed property. Swift runs the enclosed code each time the property is read instead of storing a separate value.
- Line 24: `NavigationStack {` Starts a SwiftUI navigation container. It enables titles and push-style navigation to child screens.
- Line 25: `Group {` Starts a SwiftUI `Group`, which lets related view-building code be organized without adding a visible container to the layout.
- Line 26: `switch viewModel.state {` Starts a `switch`, which matches one value against several cases in a structured and readable way.
- Line 27: `case .loading: ProgressView()` Declares one enum case, meaning one allowed named value inside the surrounding enum.
- Line 28: `case .empty:` Declares one enum case, meaning one allowed named value inside the surrounding enum.
- Line 29: `ContentUnavailableView(` Creates Apple’s standard empty-state or error-state view with a title, system symbol, and optional description.
- Line 30: `"No validation history",` The source on this line is `"No validation history",`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 31: `systemImage: "clock"` The source on this line is `systemImage: "clock"`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 32: `)` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 33: `case .failure(let message):` Declares one enum case, meaning one allowed named value inside the surrounding enum.
- Line 34: `ContentUnavailableView(` Creates Apple’s standard empty-state or error-state view with a title, system symbol, and optional description.
- Line 35: `"History unavailable",` The source on this line is `"History unavailable",`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 36: `systemImage: "exclamationmark.triangle",` The source on this line is `systemImage: "exclamationmark.triangle",`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 37: `description: Text(message)` The source on this line is `description: Text(message)`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 38: `)` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 39: `case .loaded(let records):` Declares one enum case, meaning one allowed named value inside the surrounding enum.
- Line 40: `List(records) { record in` Starts a SwiftUI list, which is the standard scrolling row-based container in many iOS apps.
- Line 41: `VStack(alignment: .leading) {` The source on this line is `VStack(alignment: .leading) {`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 42: `Text(record.packageId ?? record.fileName).font(` Creates a SwiftUI text view that displays a string on screen.
- Line 43: `.headline` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 44: `)` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 45: `Text(` Creates a SwiftUI text view that displays a string on screen.
- Line 46: `"\(record.status) · \(record.attemptedAt.formatted())"` The source on this line is `"\(record.status) · \(record.attemptedAt.formatted())"`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 47: `)` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 48: `ForEach(record.issues, id: \.self) {` Starts a SwiftUI `ForEach`, which repeats child views for each element of some data collection.
- Line 49: `Text($0).font(.caption)` Creates a SwiftUI text view that displays a string on screen.
- Line 50: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 51: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 52: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 53: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 54: `}.navigationTitle("Validation History").toolbar {` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 55: `ToolbarItem(placement: .topBarTrailing) {` The source on this line is `ToolbarItem(placement: .topBarTrailing) {`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 56: `Button("Close", systemImage: "xmark") { dismiss() }` Creates a SwiftUI button. The attached closure is the action that runs when the operator taps it.
- Line 57: `.buttonStyle(.bordered).buttonBorderShape(.circle)` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 58: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 59: `}.task { await viewModel.load() }` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 60: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 61: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 62: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.

## Why This File Matters
This file implements the validation history sheet that shows prior manifest import attempts stored on the device.

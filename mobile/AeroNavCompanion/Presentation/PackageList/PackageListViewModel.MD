# PackageListViewModel.swift

Source: `Presentation/PackageList/PackageListViewModel.swift`

## Purpose
This file coordinates the main package list data, manifest import workflow, and history recording for import attempts.

## Architecture Role
Presentation layer view model. It is the main state owner for the home screen and the place where imported packages are inserted into the list.

## App Flow Context
The list view asks this view model to import a manifest, then the view model validates the file, updates the list, publishes banner state, and records history.

## Line-by-Line Explanation
- Line 1: `import Foundation` Imports Foundation, which provides core Swift types such as `Date`, `URL`, `UUID`, `JSONDecoder`, and file-system utilities used by this app.
- Line 2: `<blank>` Blank line used only for visual separation between related pieces of code.
- Line 3: `@MainActor` Pins the following type to the main actor. In practice, that means its UI-facing state is expected to be accessed on the main thread.
- Line 4: `final class PackageListViewModel: ObservableObject {` Declares the reference type `PackageListViewModel`. Swift classes are used when one shared object instance should be observed or passed around.
- Line 5: `enum ImportState {` Declares the enum `ImportState`. Enums model a fixed set of cases, which is useful for statuses and UI states.
- Line 6: `case idle, loading` Declares one enum case, meaning one allowed named value inside the surrounding enum.
- Line 7: `case result(ManifestImportOutcome)` Declares one enum case, meaning one allowed named value inside the surrounding enum.
- Line 8: `case failure(String)` Declares one enum case, meaning one allowed named value inside the surrounding enum.
- Line 9: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 10: `@Published private(set) var packages: [NavigationPackage]` `@Published` marks observable state. When this property changes, SwiftUI views watching the object know they may need to redraw.
- Line 11: `@Published private(set) var importState: ImportState = .idle` `@Published` marks observable state. When this property changes, SwiftUI views watching the object know they may need to redraw.
- Line 12: `private let importer: any ManifestImporting` The source on this line is `private let importer: any ManifestImporting`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 13: `let historyStore: any ValidationHistoryStoring` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 14: `<blank>` Blank line used only for visual separation between related pieces of code.
- Line 15: `init(` Starts an initializer. `init` is Swift’s constructor and is responsible for preparing a new instance with valid stored properties.
- Line 16: `packages: [NavigationPackage] = SamplePackages.all,` The source on this line is `packages: [NavigationPackage] = SamplePackages.all,`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 17: `importer: any ManifestImporting = ManifestImportService(),` The source on this line is `importer: any ManifestImporting = ManifestImportService(),`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 18: `historyStore: any ValidationHistoryStoring =` The source on this line is `historyStore: any ValidationHistoryStoring =`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 19: `JSONValidationHistoryStore()` The source on this line is `JSONValidationHistoryStore()`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 20: `) {` The source on this line is `) {`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 21: `self.packages = packages` The source on this line is `self.packages = packages`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 22: `self.importer = importer` The source on this line is `self.importer = importer`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 23: `self.historyStore = historyStore` The source on this line is `self.historyStore = historyStore`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 24: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 25: `func importManifest(from url: URL) async {` Starts the function `importManifest`. Functions group behavior into a reusable named operation.
- Line 26: `importState = .loading` The source on this line is `importState = .loading`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 27: `let now = Date()` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 28: `do {` Starts a `do` block so the code inside can call throwing operations and pair them with `catch` handling.
- Line 29: `let result = try await importer.importManifest(from: url, now: now)` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 30: `if let package = result.package {` Starts an `if` condition. The following block runs only when the condition evaluates to true.
- Line 31: `packages.removeAll { $0.id == package.id }` The source on this line is `packages.removeAll { $0.id == package.id }`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 32: `packages.insert(package, at: 0)` The source on this line is `packages.insert(package, at: 0)`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 33: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 34: `importState = .result(result)` The source on this line is `importState = .result(result)`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 35: `try? await historyStore.append(` The source on this line is `try? await historyStore.append(`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 36: `.init(` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 37: `id: UUID(),` The source on this line is `id: UUID(),`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 38: `attemptedAt: now,` The source on this line is `attemptedAt: now,`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 39: `fileName: url.lastPathComponent,` The source on this line is `fileName: url.lastPathComponent,`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 40: `packageId: result.package?.id,` The source on this line is `packageId: result.package?.id,`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 41: `status: result.status?.rawValue ?? "Failed",` The source on this line is `status: result.status?.rawValue ?? "Failed",`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 42: `issues: result.issues.map(\.message)` The source on this line is `issues: result.issues.map(\.message)`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 43: `)` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 44: `)` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 45: `} catch {` Handles any error thrown by the preceding `do` block.
- Line 46: `importState = .failure(error.localizedDescription)` The source on this line is `importState = .failure(error.localizedDescription)`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 47: `try? await historyStore.append(` The source on this line is `try? await historyStore.append(`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 48: `.init(` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 49: `id: UUID(),` The source on this line is `id: UUID(),`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 50: `attemptedAt: now,` The source on this line is `attemptedAt: now,`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 51: `fileName: url.lastPathComponent,` The source on this line is `fileName: url.lastPathComponent,`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 52: `packageId: nil,` The source on this line is `packageId: nil,`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 53: `status: "Failed",` The source on this line is `status: "Failed",`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 54: `issues: [error.localizedDescription]` The source on this line is `issues: [error.localizedDescription]`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 55: `)` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 56: `)` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 57: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 58: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 59: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.

## Why This File Matters
This file coordinates the main package list data, manifest import workflow, and history recording for import attempts.

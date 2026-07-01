# AeroNavCompanionApp.swift

Source: `App/AeroNavCompanionApp.swift`

## Purpose
This is the iOS app entry point. It tells SwiftUI which screen to create first, so the operator lands on the package list as soon as the app launches.

## Architecture Role
App layer. It is the composition root for the mobile companion and currently wires the list view to its default view model.

## App Flow Context
When iOS starts the app, SwiftUI reads this file first, creates the app scene, and shows `PackageListView`, which then drives navigation into details, import, history, diagnostics, and the companion bridge.

## Line-by-Line Explanation
- Line 1: `import SwiftUI` Imports the SwiftUI framework, which provides declarative UI types like `View`, `NavigationStack`, `List`, and property wrappers such as `@StateObject`.
- Line 2: `<blank>` Blank line used only for visual separation between related pieces of code.
- Line 3: `@main` Marks the app entry type. Swift looks for exactly one `@main` starting point when the application launches.
- Line 4: `struct AeroNavCompanionApp: App {` Declares the Swift `struct` named `AeroNavCompanionApp`. Structs are value types, which makes them a common fit for data models and SwiftUI views.
- Line 5: `var body: some Scene {` Starts a computed property. Swift runs the enclosed code each time the property is read instead of storing a separate value.
- Line 6: `WindowGroup {` Creates the main application window scene. On iPhone this effectively means the root screen content for the app.
- Line 7: `PackageListView(viewModel: PackageListViewModel())` The source on this line is `PackageListView(viewModel: PackageListViewModel())`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 8: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 9: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 10: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.

## Why This File Matters
This is the iOS app entry point. It tells SwiftUI which screen to create first, so the operator lands on the package list as soon as the app launches.

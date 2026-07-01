# AeroNavCompanionApp.swift

Source: `App/AeroNavCompanionApp.swift`

## Purpose
Defines the iOS entry point and composes the first screen shown when AeroNav Companion launches.

## Architecture Role
App layer. This is the composition root for the mobile app.

## App Flow Context
When iOS launches the app, SwiftUI instantiates this `App` type, opens a window scene, and renders the package list as the root screen.

## Swift Concepts To Notice
- `@main`: Marks the program entry type. Unlike a manual `main()` in C, SwiftUI apps usually declare one type that the runtime boots directly.
- `App` protocol: Replaces older `UIApplicationDelegate`-style startup for simple SwiftUI apps. Conforming types describe scenes instead of manually pushing root controllers.
- `some Scene`: An opaque return type. It means the property returns one concrete scene type chosen by the implementation, while callers only know it conforms to `Scene`.
- `WindowGroup`: Creates the app window scene. On iPhone this is effectively the root container that hosts the first visible SwiftUI view.

## Semantic Walkthrough
- Line 1: Imports SwiftUI because both the app entry type and the root scene are declared in SwiftUI rather than UIKit.
- Lines 3-4: Declare `AeroNavCompanionApp` as the process entry point and make it conform to `App`. The conformance means this type must describe at least one scene for the runtime to show.
- Lines 5-8: Implement the required `body` property as `some Scene`. The important Swift idea here is that `some` hides the exact return type while still preserving static type information for the compiler. The body returns a `WindowGroup` whose content closure constructs `PackageListView(viewModel: PackageListViewModel())`, so startup composition happens here instead of through a separate dependency container.

## Why This File Matters
Defines the iOS entry point and composes the first screen shown when AeroNav Companion launches.

# NavigationPackage.swift

Source: `Domain/NavigationPackage.swift`

## Purpose
This file defines the core data shapes the mobile app uses to display package metadata, status, and declared files.

## Architecture Role
Domain layer. These types stay lightweight so both view models and services can exchange package information without UI-specific code.

## App Flow Context
Imported manifests, sample data, and list/detail screens all pass around these domain values. They are the shared language of the app.

## Line-by-Line Explanation
- Line 1: `import Foundation` Imports Foundation, which provides core Swift types such as `Date`, `URL`, `UUID`, `JSONDecoder`, and file-system utilities used by this app.
- Line 2: `<blank>` Blank line used only for visual separation between related pieces of code.
- Line 3: `struct NavigationPackage: Identifiable, Equatable, Sendable {` Declares the Swift `struct` named `NavigationPackage`. Structs are value types, which makes them a common fit for data models and SwiftUI views.
- Line 4: `let id: String` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 5: `let provider: String` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 6: `let source: String` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 7: `let cycle: String` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 8: `let region: String` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 9: `let targetDevice: String` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 10: `let effectiveFrom: Date` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 11: `let effectiveTo: Date` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 12: `let status: PackageStatus` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 13: `let files: [PackageFileDisplay]` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 14: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 15: `<blank>` Blank line used only for visual separation between related pieces of code.
- Line 16: `enum PackageStatus: String, CaseIterable, Equatable, Sendable {` Declares the enum `PackageStatus`. Enums model a fixed set of cases, which is useful for statuses and UI states.
- Line 17: `case valid = "Valid"` Declares one enum case, meaning one allowed named value inside the surrounding enum.
- Line 18: `case warning = "Warning"` Declares one enum case, meaning one allowed named value inside the surrounding enum.
- Line 19: `case failed = "Failed"` Declares one enum case, meaning one allowed named value inside the surrounding enum.
- Line 20: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 21: `<blank>` Blank line used only for visual separation between related pieces of code.
- Line 22: `struct PackageFileDisplay: Identifiable, Equatable, Sendable {` Declares the Swift `struct` named `PackageFileDisplay`. Structs are value types, which makes them a common fit for data models and SwiftUI views.
- Line 23: `var id: String { path }` Starts a computed property. Swift runs the enclosed code each time the property is read instead of storing a separate value.
- Line 24: `let path: String` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 25: `let category: String` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 26: `let required: Bool` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 27: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 28: `<blank>` Blank line used only for visual separation between related pieces of code.
- Line 29: `struct PackageCategoryGroup: Identifiable, Equatable, Sendable {` Declares the Swift `struct` named `PackageCategoryGroup`. Structs are value types, which makes them a common fit for data models and SwiftUI views.
- Line 30: `var id: String { category }` Starts a computed property. Swift runs the enclosed code each time the property is read instead of storing a separate value.
- Line 31: `let category: String` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 32: `let files: [PackageFileDisplay]` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 33: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.

## Why This File Matters
This file defines the core data shapes the mobile app uses to display package metadata, status, and declared files.

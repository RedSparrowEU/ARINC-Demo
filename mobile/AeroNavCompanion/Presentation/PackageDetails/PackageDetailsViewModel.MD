# PackageDetailsViewModel.swift

Source: `Presentation/PackageDetails/PackageDetailsViewModel.swift`

## Purpose
Prepares grouped and formatted package data for the detail screen.

## Architecture Role
Presentation view-model layer. It keeps sorting and formatting out of the SwiftUI body.

## App Flow Context
The package list constructs this model for the selected package; the detail view then reads precomputed groups and a formatted effective-period string.

## Swift Concepts To Notice
- `@MainActor` on a class: This is a concurrency guarantee: even though the type is simple, its public interface is meant to be used from UI code on the main actor.
- Key paths like `\PackageFileDisplay.category`: Swift key paths are typed references to properties and are commonly used by collection helpers such as `Dictionary(grouping:by:)`.
- `Self` in static context: Inside an instance property, `Self.dateFormatter` explicitly refers to the type-level formatter rather than an instance member.
- Closure-initialized `static let`: A common Swift pattern for expensive reusable helpers such as formatters: create them once, configure them in a closure, and cache the result.

## Semantic Walkthrough
- Line 1: Imports Foundation for `DateFormatter`, `Locale`, and `TimeZone`.
- Lines 3-6: Declare the main-actor `ObservableObject` class and store the selected package plus its already-transformed category groups.
- Lines 8-13: In the initializer, group files by category with `Dictionary(grouping:by:)`, using a key path instead of an explicit closure for the grouping key. The later `map` and `sorted` closures convert dictionary entries into a predictable section order for the UI.
- Lines 15-17: Expose `effectivePeriod` as a computed property. `Self.dateFormatter` is a Swift way to say “use the type-level formatter defined below,” and the interpolation expression builds the exact string the detail view displays.
- Lines 19-25: Create a private static formatter in a closure. This is an idiomatic Swift alternative to a global singleton: the formatter is lazily initialized once, configured with a stable POSIX locale and UTC timezone, and then reused for every instance.

## Why This File Matters
Prepares grouped and formatted package data for the detail screen.

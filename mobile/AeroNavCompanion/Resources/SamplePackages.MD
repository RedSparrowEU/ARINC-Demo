# SamplePackages.swift

Source: `Resources/SamplePackages.swift`

## Purpose
Provides non-operational sample packages so the mobile app has meaningful content before the user imports anything.

## Architecture Role
Resources layer. This file is sample-data composition, not UI logic.

## App Flow Context
The package list view model defaults to `SamplePackages.all`, which gives the home screen immediate valid, warning, and failed examples.

## Swift Concepts To Notice
- Enum as namespace: Swift enums can be used as a namespacing tool when you want grouped static members but no instances.
- `static let` sample fixtures: Type-level constants are initialized once and then reused anywhere in the app.
- Shorthand `.init(...)`: Swift can infer the concrete type from context, so `.init(...)` is often used instead of spelling the full type name.
- Force unwrap `!`: Used here in fixture-building helpers where invalid internal constants would be a programmer error, not user input.

## Semantic Walkthrough
- Line 1: Imports Foundation for `Date`, `Calendar`, `TimeZone`, and `DateComponents`.
- Lines 3-14: Declare the `SamplePackages` namespace and build the `valid` fixture with a helper call. The array uses shorthand `.init(...)` because the surrounding `files:` context already tells Swift the element type is `PackageFileDisplay`.
- Lines 16-25: Define the `warning` fixture. Structurally it mirrors the valid fixture, but the package status and file list are chosen to demonstrate a warning state in the UI.
- Lines 27-35: Define the `failed` fixture and then collect all fixtures into `all`. The explicit `all` array is what the package list view model uses as its default source.
- Lines 37-56: Centralize common package construction in a private static helper. Making this function `private` keeps fixture-building policy local to this file, and returning `NavigationPackage` preserves the same domain type the rest of the app uses for imported data.
- Lines 58-62: Build UTC dates with a helper. The `var calendar` is mutable because the timezone is reconfigured after creation, and the force unwraps are acceptable here because the inputs are hard-coded test fixture values controlled by the source itself.

## Why This File Matters
Provides non-operational sample packages so the mobile app has meaningful content before the user imports anything.

# PackageDetailsViewModel.swift

Source: `Presentation/PackageDetails/PackageDetailsViewModel.swift`

## Purpose
This file prepares package-detail data for the detail screen by grouping files by category and formatting the effective date range.

## Architecture Role
Presentation layer view model. It keeps sorting and formatting logic out of the SwiftUI view body.

## App Flow Context
The list screen creates this view model for the selected package, then the details screen reads its precomputed groups and formatted date text.

## Line-by-Line Explanation
- Line 1: `import Foundation` Imports Foundation, which provides core Swift types such as `Date`, `URL`, `UUID`, `JSONDecoder`, and file-system utilities used by this app.
- Line 2: `<blank>` Blank line used only for visual separation between related pieces of code.
- Line 3: `@MainActor` Pins the following type to the main actor. In practice, that means its UI-facing state is expected to be accessed on the main thread.
- Line 4: `final class PackageDetailsViewModel: ObservableObject {` Declares the reference type `PackageDetailsViewModel`. Swift classes are used when one shared object instance should be observed or passed around.
- Line 5: `let package: NavigationPackage` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 6: `let categoryGroups: [PackageCategoryGroup]` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 7: `<blank>` Blank line used only for visual separation between related pieces of code.
- Line 8: `init(package: NavigationPackage) {` Starts an initializer. `init` is Swift’s constructor and is responsible for preparing a new instance with valid stored properties.
- Line 9: `self.package = package` The source on this line is `self.package = package`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 10: `categoryGroups = Dictionary(grouping: package.files, by: \PackageFileDisplay.category)` This line continues the surrounding Swift statement with additional arguments, data, or formatting.
- Line 11: `.map { PackageCategoryGroup(category: $0.key, files: $0.value.sorted { $0.path < $1.path }) }` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 12: `.sorted { $0.category < $1.category }` Continues the previous expression with another SwiftUI modifier or method call. Chaining like this is a very common Swift style.
- Line 13: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 14: `<blank>` Blank line used only for visual separation between related pieces of code.
- Line 15: `var effectivePeriod: String {` Starts a computed property. Swift runs the enclosed code each time the property is read instead of storing a separate value.
- Line 16: `"\(Self.dateFormatter.string(from: package.effectiveFrom)) – \(Self.dateFormatter.string(from: package.effectiveTo))"` This line continues the surrounding Swift statement with additional arguments, data, or formatting.
- Line 17: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 18: `<blank>` Blank line used only for visual separation between related pieces of code.
- Line 19: `private static let dateFormatter: DateFormatter = {` The source on this line is `private static let dateFormatter: DateFormatter = {`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 20: `let formatter = DateFormatter()` Declares an immutable stored value with `let`. Once a value is assigned for this instance, the property itself does not change.
- Line 21: `formatter.locale = Locale(identifier: "en_US_POSIX")` The source on this line is `formatter.locale = Locale(identifier: "en_US_POSIX")`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 22: `formatter.timeZone = TimeZone(secondsFromGMT: 0)` The source on this line is `formatter.timeZone = TimeZone(secondsFromGMT: 0)`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 23: `formatter.dateFormat = "yyyy-MM-dd"` The source on this line is `formatter.dateFormat = "yyyy-MM-dd"`. It contributes to the surrounding declaration or expression exactly where it appears.
- Line 24: `return formatter` Returns a value from the current function or computed property.
- Line 25: `}()` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.
- Line 26: `}` Closes part of the surrounding scope, closure, or argument list that started on earlier lines.

## Why This File Matters
This file prepares package-detail data for the detail screen by grouping files by category and formatting the effective date range.

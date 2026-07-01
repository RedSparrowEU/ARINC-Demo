# PackageListViewModel.swift

Source: `Presentation/PackageList/PackageListViewModel.swift`

## Purpose
Owns package-list state, drives manifest imports, and records validation attempts into history.

## Architecture Role
Presentation view-model layer. This is the main state owner behind the home screen.

## App Flow Context
The home screen calls `importManifest(from:)`, which awaits the importer, updates the in-memory package list, publishes banner state, and appends history records.

## Swift Concepts To Notice
- `@Published private(set)`: Swift allows a property to be publicly readable but privately writable. Combined with `@Published`, the view can observe updates while outside code cannot arbitrarily mutate state.
- `any` existentials for dependencies: Both importer and history store are protocol-typed dependencies. Explicit `any` makes it clear these are runtime boxes around unknown conforming concrete types.
- Enum cases with payloads: The `result(ManifestImportOutcome)` and `failure(String)` cases encode UI state and its associated data in one typed value.
- Key-path mapping `map(\.message)`: Swift key paths can be passed where a closure of the right shape is expected, giving a concise alternative to `{ $0.message }`.
- `try? await`: This intentionally drops storage-write errors after awaiting them. In this flow, import results matter more than failing the entire UI action because history persistence failed.

## Semantic Walkthrough
- Line 1: Imports Foundation for `Date`, `UUID`, and `URL` used by the import workflow.
- Lines 3-9: Declare the main-actor view model, its nested `ImportState` enum, and the published state fields. `private(set)` is the crucial Swift access-control detail: views and tests can read these properties, but only the view model can mutate them directly.
- Lines 11-15: Provide dependency-injected defaults. The initializer shows Swift’s default-argument model: if the caller does nothing, the app uses sample packages, the real manifest importer, and the JSON history store.
- Line 16: Implement the whole import workflow in one compact async function. The code switches `importState` to loading, captures `now`, awaits the importer existential, conditionally replaces an existing package with the same id via `if let`, publishes success or failure state, and appends a history record with `try? await`. The final `map(\.message)` is a concise Swift key-path projection from issue objects to display strings.

## Why This File Matters
Owns package-list state, drives manifest imports, and records validation attempts into history.

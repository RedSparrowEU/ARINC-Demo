# ValidationHistoryStoring.swift

Source: `Persistence/ValidationHistoryStoring.swift`

## Purpose
Defines the persistence contract and JSON-backed actor that store manifest import history for the mobile app.

## Architecture Role
Persistence layer. This file owns the boundary between in-memory view models and on-disk history storage.

## App Flow Context
After each import attempt, the package list view model appends a record here; the history screen later loads those records back from the same store.

## Swift Concepts To Notice
- `Codable`: Swift can synthesize JSON encoding/decoding for simple structs, which is why the history record and envelope types stay compact.
- `async throws` in protocols: The protocol says callers must await the operation and handle failure, but it does not commit the app to one concrete storage backend.
- `actor`: Actors are Swift’s built-in isolation mechanism for mutable shared state. That matters here because loading and appending history can happen from async UI flows.
- Type-level helpers in extensions: The private `JSONDecoder.iso` and `JSONEncoder.iso` properties bundle shared configuration into reusable factories instead of repeating setup inline.

## Semantic Walkthrough
- Line 1: Imports Foundation for `UUID`, `Date`, `URL`, file management, and JSON support.
- Line 2: Defines `ValidationHistoryRecord` as a compact `Codable` value. The single line packs several Swift ideas together: synthesized JSON support, `Identifiable` for SwiftUI lists, and `Sendable` for concurrency safety.
- Line 3: Declares `ValidationHistoryStoring` as a protocol with `async throws` operations. In Swift, `async` and `throws` are part of the function type itself, so the protocol communicates both latency and failure explicitly.
- Lines 4-9: Implement `JSONValidationHistoryStore` as an `actor`. The nested `Envelope` type carries a schema version plus entries, the default `url` points into Application Support, `load()` validates the file and sorts newest-first, and `append()` prepends, trims to 100 records, creates parent directories, and performs an atomic write. The actor boundary is the important Swift feature: code outside the actor must await access instead of racing shared mutable state.
- Lines 10-11: Add private extensions that expose preconfigured ISO-8601 encoder/decoder factories. This is idiomatic Swift: extend an existing type with domain-specific helpers instead of introducing a standalone utility class.

## Why This File Matters
Defines the persistence contract and JSON-backed actor that store manifest import history for the mobile app.

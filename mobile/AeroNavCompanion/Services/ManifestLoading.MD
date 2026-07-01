# ManifestLoading.swift

Source: `Services/ManifestLoading.swift`

## Purpose
Abstracts file loading and implements the iOS-specific loader used by both manifest and diagnostics imports.

## Architecture Role
Service layer. This file owns security-scoped file access and background I/O details.

## App Flow Context
Import services call this loader to read user-selected files safely without blocking the main actor.

## Swift Concepts To Notice
- Security-scoped resources: On Apple platforms, document-picker URLs may require temporary access tokens. Swift code must explicitly start and stop that access.
- `defer`: Runs cleanup when the current scope exits, regardless of whether the function returns normally or throws.
- `Task.detached`: Creates async work that does not inherit the current actor. That is appropriate here because raw file I/O should not stay on the main actor.
- `await ... .value`: Detached tasks produce task handles; awaiting `.value` retrieves the result or rethrows the task’s error.

## Semantic Walkthrough
- Line 1: Imports Foundation for `URL`, `Data`, and file I/O.
- Lines 3-5: Declare the `ManifestLoading` protocol. This isolates raw file access behind an async/throwing boundary that higher-level services can depend on.
- Lines 7-14: Implement the local iOS loader. The function starts security-scoped access, uses `defer` so access is always released, and then returns `try await Task.detached(...).value` so `Data(contentsOf:)` runs off the current actor. The Swift point is that concurrency and cleanup are both expressed directly in the language rather than by external callback utilities.

## Why This File Matters
Abstracts file loading and implements the iOS-specific loader used by both manifest and diagnostics imports.

# Complete desktop Phase 1 import and validation

Date: 2026-06-30 17:35
Scope: desktop
Branch: feature/phase-1-import-and-package-details

## Goal

Implement safe package-folder import, manifest parsing, checksum validation, package summary, file tree, and validation reporting.

## Context

The desktop application is buildable but currently exposes only an initialization shell.

## Plan

1. Add manifest, imported-package, file-tree, and validation domain contracts.
2. Implement deterministic parsing, safe filesystem inspection, checksums, and Phase 1 validation.
3. Expose folder import over restricted IPC and build the renderer workflow with targeted tests.

## Acceptance criteria

- A selected package folder is safely parsed and shown with metadata, files, checksums, and issues.
- Invalid JSON, fields, dates, paths, files, and checksums produce deterministic results.
- Device compatibility, export, diagnostics, and history are not implemented.

## Validation commands

- `npm install`
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm audit --omit=dev`

## Risks

- Imported files are untrusted and must never escape the selected root through paths or symlinks.

## Rollback plan

Revert the desktop Phase 1 commits; no user data migration is introduced.

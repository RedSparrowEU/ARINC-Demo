# Add mobile simulator Makefile

Date: 2026-06-30 23:00
Scope: mobile
Branch: chore/mobile-simulator-makefile

## Goal

Provide one command that builds, installs, and launches the mobile app in an available iOS simulator.

## Context

The documented workflow requires several manual Xcode and `simctl` commands. A mobile-scoped Makefile makes local simulator startup repeatable while retaining an override for the installed simulator name.

## Plan

1. Add a mobile Makefile that resolves and boots the requested simulator.
2. Build to a deterministic ignored DerivedData directory, then install and launch the app.
3. Document the default command and simulator override and validate the workflow.

## Acceptance criteria

- `make run` from `mobile/` launches AeroNav Companion on the documented default simulator.
- Developers can select another installed simulator with `SIMULATOR='<device name>'`.
- A missing simulator produces an actionable error without attempting a build.

## Validation commands

- `xcodebuild -list -project AeroNavCompanion.xcodeproj`
- `make simulator-id`
- `make run`
- `xcodebuild test -project AeroNavCompanion.xcodeproj -scheme AeroNavCompanion -destination 'platform=iOS Simulator,name=iPhone 17 Pro,OS=26.0.1'`

## Risks

- The default simulator may not be installed on every development machine; use the documented `SIMULATOR` override.

## Rollback plan

Remove the Makefile and its documentation; no application code or persisted data is affected.

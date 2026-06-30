# Add mobile sheet close controls

Date: 2026-06-30 22:48
Scope: mobile
Branch: fix/mobile-sheet-close-controls

## Goal

Provide an explicit close control for the Companion Bridge, Diagnostics, and Validation History sheets.

## Context

The three modal cards can currently be dismissed only with the system sheet gesture, making their exit behavior less discoverable and inconsistent with other card interactions.

## Plan

1. Add an accessible circular close button to each modal navigation toolbar.
2. Dismiss only the active sheet while preserving existing toolbar and nested-sheet behavior.
3. Validate the app and controls in the iPhone simulator.

## Acceptance criteria

- Each targeted sheet displays a top-trailing circular `X` button labeled `Close` for accessibility.
- Activating a close button dismisses only its current sheet.
- Diagnostics import and Companion Bridge scanning behavior remain available.

## Validation commands

- `xcodebuild -list -project AeroNavCompanion.xcodeproj`
- `xcodebuild test -project AeroNavCompanion.xcodeproj -scheme AeroNavCompanion -destination 'platform=iOS Simulator,name=iPhone 17 Pro,OS=26.0.1'`
- `xcodebuild build -project AeroNavCompanion.xcodeproj -scheme AeroNavCompanion -destination 'platform=iOS Simulator,name=iPhone 17 Pro,OS=26.0.1'`

## Risks

- Toolbar spacing may vary between supported iOS versions.

## Rollback plan

Revert the close-control commit; no data or persistence migration is involved.

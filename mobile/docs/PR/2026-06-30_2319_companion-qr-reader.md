# Complete mobile companion QR reader
Date: 2026-06-30 23:19
Scope: mobile
Branch: feature/companion-qr-folder-memory
## Goal
Expose a clear companion QR-reader action and automatically process detected QR payloads.
## Context
The existing scan action is hidden when unavailable and requires the operator to tap a recognized code.
## Plan
1. Keep the scanner action visible with a QR icon and explicit availability feedback.
2. Accept detected QR values automatically and decode them through the existing compact-summary codec.
3. Test scanner-result handling and update mobile documentation.
## Acceptance criteria
- Companion Bridge always shows a labeled QR reader action.
- Supported devices automatically read and dismiss after detecting a valid or invalid QR value.
- Unsupported environments explain why scanning cannot start.
## Validation commands
- `xcodebuild -list -project AeroNavCompanion.xcodeproj`
- `xcodebuild test -project AeroNavCompanion.xcodeproj -scheme AeroNavCompanion -destination '<available simulator>'`
- `xcodebuild build -project AeroNavCompanion.xcodeproj -scheme AeroNavCompanion -destination '<available simulator>'`
## Risks
- VisionKit camera scanning cannot be exercised in the iOS Simulator.
## Rollback plan
Revert the feature commit to restore the conditional, tap-driven scanner.

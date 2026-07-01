# Document mobile Swift sources for beginners
Date: 2026-07-01 20:26
Scope: mobile
Branch: docs/mobile-swift-source-companions
## Goal
Create beginner-oriented Markdown companions for every Swift source file in `mobile/AeroNavCompanion` and add a source-folder overview that links them.
## Context
The mobile app source is compact enough to document file-by-file, and the requested output should teach Swift syntax in the context of the app’s manifest, history, diagnostics, and bridge workflows.
## Plan
1. Generate one `.MD` companion beside each `mobile/AeroNavCompanion` Swift source file with line-by-line explanations.
2. Add `mobile/AeroNavCompanion/OVERVIEW.MD` as the entry document with subsystem grouping and reading order.
3. Update the mobile changelog and verify coverage plus overview links.
## Acceptance criteria
- Every `mobile/AeroNavCompanion` `.swift` source has a matching `.MD` companion in the same folder.
- `mobile/AeroNavCompanion/OVERVIEW.MD` links to all generated companion docs and explains the app flow.
- The new docs explain every source line for a Swift beginner and stay tied to AeroNav Companion behavior.
## Validation commands
- `python3 /tmp/verify_mobile_swift_docs.py`
- `git status --short --branch`
## Risks
- The documentation volume is large, so consistency depends on using one stable explanation format across all files.
## Rollback plan
Remove the generated `.MD` companions, the overview document, and the related mobile docs entries.

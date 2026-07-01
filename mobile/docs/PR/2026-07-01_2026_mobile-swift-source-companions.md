# Rewrite mobile Swift companion docs around language concepts
Date: 2026-07-01 21:49
Scope: mobile
Branch: chore/mobile-swift-source-companions
## Goal
Replace the low-value punctuation-level Markdown explanations with Swift-language explanations aimed at programmers who are new to Swift but not new to programming.
## Context
The first pass documented too much structural noise and too little Swift-specific meaning. The rewrite should explain constructs such as `some`, `any`, property wrappers, actors, result builders, and bindings in the context of AeroNav Companion behavior.
## Plan
1. Rewrite every generated `mobile/AeroNavCompanion` companion doc using semantic line ranges instead of one bullet per source line.
2. Revise `mobile/AeroNavCompanion/OVERVIEW.MD` so it explains the concept-oriented reading strategy and preserves links to all companion docs.
3. Append a new mobile changelog entry, verify content regressions are gone, and update PR `#13` to describe the rewrite quality bar.
## Acceptance criteria
- No companion doc contains filler phrases about blank lines, closing braces, or generic `source on this line` commentary.
- Files that use `some`, `any`, property wrappers, actors, bindings, or result builders explicitly explain those Swift features.
- Every Swift source file still has a matching `.MD` file in the same folder, and `OVERVIEW.MD` links to all of them.
## Validation commands
- `python3 /tmp/verify_mobile_swift_docs_rewrite.py`
- `git status --short --branch`
## Risks
- Several source files are intentionally compressed onto one line, so each explanation must unpack multiple Swift constructs without becoming vague.
## Rollback plan
Revert the rewrite commit on `chore/mobile-swift-source-companions` to restore the prior generated docs and PR metadata.

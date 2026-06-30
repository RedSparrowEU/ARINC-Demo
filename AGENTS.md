# AGENTS.md — Compact

Rules for **AeroNav Data Loader** contributors. Apps: `desktop/` Electron/macOS demo aviation package import/validation/export simulation/diagnostics; `mobile/` Swift/iOS companion for status, manifest import, history, diagnostics. Use **English** for all plans, notes, PRs, changelogs, and handoffs.

## 1. Scope, layout, data

Classify work first: `desktop-only`, `mobile-only`, `cross-app`, `docs-only`, `planning-only`.

Root may contain only cross-project docs/policy/config, samples, and app folders: `README.md`, `AGENTS.md`, `sample-packages/`, `desktop/`, `mobile/`.

Desktop owns `desktop/src/`, `desktop/package.json`, lockfile/Electron config, `desktop/docs/`, `desktop/docs/change.log`, `desktop/docs/PR/`. Mobile owns `mobile/AeroNavCompanion/`, `mobile/AeroNavCompanionTests/`, `.xcodeproj`/`.xcworkspace`, `mobile/docs/`, `mobile/docs/change.log`, `mobile/docs/PR/`. Do not change the other app for app-only work unless cross-app behavior is required.

Samples live in `sample-packages/`. Label sample aviation data as public non-operational, generated mock, derived demo, or test fixture. No proprietary vendor data without explicit owner approval. Never present demo data as certified, operational, or flight-ready.

## 2. Docs, changelogs, PR plans

Keep durable decisions in docs, not chat only. Root `README.md` must cover goal, demo disclaimer, architecture, desktop/mobile workflows, sample package structure, validation, testing, docs rules, and deeper-doc links. Desktop docs: `desktop/docs/`; mobile docs: `mobile/docs/`.

Every implementation change updates the relevant `change.log`. Every implementation plan creates the relevant PR-plan file. Cross-app work requires both apps' changelogs and PR plans.

PR-plan paths: `desktop/docs/PR/YYYY-MM-DD_HHMM_short-plan-name.md`, `mobile/docs/PR/YYYY-MM-DD_HHMM_short-plan-name.md`.

Changelog format:
```text
YYYY-MM-DD HH:MM
Scope: desktop | mobile
Type: feature | fix | chore | docs | refactor | test
Summary: <short summary>
Files changed:
- <path>
Validation:
- <command>: <PASS|FAIL|SKIPPED> — <short note>
Notes:
- <important implementation or product note>
```

PR-plan format:
```markdown
# <Plan title>
Date: YYYY-MM-DD HH:MM
Scope: desktop | mobile
Branch: feature/<name> | fix/<name> | chore/<name>
## Goal
<What this change accomplishes.>
## Context
<Why it is needed.>
## Plan
1. <Step one>
2. <Step two>
3. <Step three>
## Acceptance criteria
- <Criterion one>
- <Criterion two>
## Validation commands
- `<command>`
## Risks
- <Risk or "None identified">
## Rollback plan
<How to revert or disable safely.>
```

## 3. Architecture

Desktop dependency direction: `renderer UI → renderer state/view models → IPC client → main process services → shared domain services`. No business logic in visual components. Reusable domain/validation: `desktop/src/shared/domain/`, `desktop/src/shared/services/`. OS/filesystem: `desktop/src/main/services/`. Renderer uses safe IPC only.

Mobile dependency direction: `SwiftUI View → ViewModel → Service/Repository protocol → concrete implementation`. Validation belongs in services, not views. Prefer `App/`, `Presentation/`, `Domain/`, `Services/`, `Persistence/`, `Resources/` under `mobile/AeroNavCompanion/`.

Keep aligned: `NavigationPackage`, `PackageManifest`, `DeviceProfile`, `ValidationIssue`, `ValidationResult`, `DiagnosticsReport`; `ExportResult` is desktop-only unless mobile needs read-only display. Manifest-shape changes require affected docs and fixture updates.

## 4. Security

Treat imports as untrusted. Never execute imported files. Prevent path traversal. Verify export paths stay inside target. No repo secrets; mock/demo keys only. No proprietary aviation data without approval. Label demo data non-operational. Never claim certification or operational suitability.

Desktop file ops: validate source/export paths, avoid overwrite without confirmation, write deterministic logs/diagnostics, avoid destructive MVP operations unless requested. Mobile import: validate type/size where practical, handle invalid JSON gracefully, keep parsing/checksum work off main thread, show actionable errors.

## 5. Startup and validation

Run environment checks only for implementation changes that mutate code/config/build scripts/tests. Skip full preflight for planning/docs unless asked.

Desktop: inspect `desktop/package.json`; use declared scripts only. Common when available: `npm install`, `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build`. Missing script: `SKIPPED: <command> — script not defined in desktop/package.json`.

Mobile: inspect Xcode project/workspace first. Common: `xcodebuild -list`; `xcodebuild test -scheme AeroNavCompanion -destination 'platform=iOS Simulator,name=iPhone 16'`. If Xcode/simulator unavailable, report exact command, concise error, `environment blocker`, next action. If simulator unavailable, inspect destinations before choosing another and report destination used.

Validation tiers: docs-only = markdown/readability/links, no build; desktop routine = typecheck/lint/test; desktop release = typecheck/lint/test/build; mobile routine = list/test; cross-app = both applicable sets. For failures, report exact command, concise error, blocker type (`environment blocker`, `process blocker`, `implementation blocker`), next action.

## 6. Workflow and Git

Before editing: classify scope, inspect files, create/update required PR-plan. Then make the smallest coherent change, test business logic, run targeted validation, update changelog, commit after validation passes. Do not mark done if required PR-plan/changelog is missing.

Branch flow: `feature/fix/chore branch → dev → stage → main`. Branch from `dev`; names start `feature/`, `fix/`, or `chore/`; no routine direct commits to `main`; use clear imperative scoped commits; commit significant checked steps; do not mix unrelated changes; PRs target `dev`; promote only after integration validation. If only `main` exists, create `dev` from current `main` first.

## 7. Fixtures and priorities

Recommended fixtures: `valid-package/`, `missing-file/`, `checksum-mismatch/`, `expired-cycle/`, `unsupported-device/`, `unsigned-package/` under `sample-packages/`. Each needs README with purpose, expected result, diagnostics, and data source type. Tests must not rely on external downloads unless required.

Desktop priorities: import, manifest parsing, checksums, device compatibility, removable-media export simulation, diagnostics, history, QA fixtures. No real avionics-device communication unless requested. Demo USB/SD = choose target folder, validate writability, create expected structure, copy files, verify checksums, write export log.

Mobile priorities: SwiftUI package list, iOS document manifest import, validation status, offline history, diagnostics review, clear empty/loading/error states. Do not duplicate desktop export workflow unless requested.

## 8. AI rules

Inspect code before proposals. Do not invent APIs/scripts/dependencies. Do not claim validation passed unless the command succeeded. Keep code simple and maintainable. Prefer explicit domain models over clever abstractions. Update docs when architecture/workflow changes.

## 9. Closeout and handoff

Complete means: implementation done; targeted validation run or blocked; changelog(s)/PR-plan(s) exist; changes committed; branch pushed unless told not to; PR to `dev` opened unless told not to; PR status reported; after merge, local copy switches to target branch and fast-forwards. If PR is open, stay on branch and report `PR pending`. If credentials/remote unavailable, report blocker and exact next action.

Final handoff format:
```text
context summary: <short summary>
commands executed:
- <command or "none">
pass/fail outcomes:
- PASS: <command/result>
- FAIL: <command/result>
- SKIPPED: <command/result>
completed actions:
- <item>
remaining actions:
- <item or "none">
blockers:
- <item or "none">
target branch: <dev unless explicitly overridden>
merge state: <not opened | PR pending | merged to dev | pending stage promotion | pending main promotion | promoted to stage | promoted to main>
validation tier: <docs-only | desktop-unit | desktop-build | mobile-unit | mobile-build | cross-app>
desktop build skip reason: <required when desktop build is not run; otherwise "not skipped">
mobile build skip reason: <required when mobile build is not run; otherwise "not skipped">
```
Keep final reports direct and execution-focused.

# AGENTS.md

This file defines repository rules for AI agents and human contributors working on AeroNav Data Loader.

The repository contains two applications:

- `desktop/` — Electron/macOS desktop application for aviation-style data package import, validation, removable-media export simulation, and diagnostics.
- `mobile/` — Swift/iOS companion application for package status, manifest import, validation history, and diagnostics review.

All planning, implementation notes, PR descriptions, changelog entries, and final handoffs must be written in English.

## 1) Documentation Baseline

Keep architecture, workflow, and validation documentation discoverable.

The root `README.md` must document:

- project goal,
- demo-domain disclaimer,
- main app architecture blocks,
- desktop workflow,
- mobile workflow,
- sample package structure,
- validation rules,
- testing strategy,
- documentation rules,
- links to deeper docs when they exist.

Desktop-specific documentation belongs under:

```text
desktop/docs/
```

Mobile-specific documentation belongs under:

```text
mobile/docs/
```

Do not bury implementation-critical decisions only in chat messages. Add durable notes to the appropriate docs.

## 2) Project Boundaries

### 2.1 Root boundaries

Root-level files should only contain cross-project documentation, shared policies, sample packages, and repository-level configuration.

Expected root-level files and directories:

```text
README.md
AGENTS.md
sample-packages/
desktop/
mobile/
```

### 2.2 Desktop boundaries

The desktop application lives in:

```text
desktop/
```

Desktop source of truth:

```text
desktop/src/
desktop/package.json
desktop/package-lock.json or desktop/pnpm-lock.yaml or desktop/yarn.lock
desktop/electron configuration files
```

Desktop docs source of truth:

```text
desktop/docs/
desktop/docs/change.log
desktop/docs/PR/
```

Do not modify mobile code to solve a desktop-only task unless the task explicitly requires cross-app behavior.

### 2.3 Mobile boundaries

The mobile application lives in:

```text
mobile/
```

Mobile source of truth:

```text
mobile/AeroNavCompanion/
mobile/AeroNavCompanionTests/
mobile/AeroNavCompanion.xcodeproj or mobile/AeroNavCompanion.xcworkspace
```

Mobile docs source of truth:

```text
mobile/docs/
mobile/docs/change.log
mobile/docs/PR/
```

Do not modify desktop code to solve a mobile-only task unless the task explicitly requires cross-app behavior.

### 2.4 Sample data boundaries

Sample packages belong under:

```text
sample-packages/
```

All sample aviation data must be clearly marked as one of:

- public non-operational data,
- generated mock data,
- derived demo data,
- test fixture data.

Do not include proprietary vendor data unless the repository owner explicitly confirms that the data is licensed for this repository.

Do not represent demo data as certified, operational, or flight-ready.

## 3) Thread Startup Rules

Before implementation, classify the task scope:

- `desktop-only`,
- `mobile-only`,
- `cross-app`,
- `docs-only`,
- `planning-only`.

Run environment checks only when executing implementation changes that mutate code, configuration, build scripts, or tests.

Do not run full preflight checks for planning-only or docs-only discussion unless the user explicitly asks.

### 3.1 Desktop implementation startup

For desktop implementation tasks, inspect:

```text
desktop/package.json
```

Then use the scripts declared by the repository. Do not invent scripts if they do not exist.

Common expected checks, when available:

```text
npm install
npm run typecheck
npm run lint
npm run test
npm run build
```

When a command is unavailable, report it as:

```text
SKIPPED: <command> — script not defined in desktop/package.json
```

### 3.2 Mobile implementation startup

For mobile implementation tasks, inspect the Xcode project/workspace first.

Common expected checks, when available:

```text
xcodebuild -list
xcodebuild test -scheme AeroNavCompanion -destination 'platform=iOS Simulator,name=iPhone 16'
```

If Xcode or the requested simulator is unavailable, classify the failure as an `environment blocker` and report:

- exact command,
- concise error summary,
- next required action.

### 3.3 Cross-app implementation startup

For cross-app tasks, validate both app boundaries and update both documentation tracks when both apps are changed.

Required documentation for cross-app implementation:

```text
desktop/docs/change.log
mobile/docs/change.log
desktop/docs/PR/YYYY-MM-DD_HHMM_<plan-name>.md
mobile/docs/PR/YYYY-MM-DD_HHMM_<plan-name>.md
```

## 4) Architecture Rules

### 4.1 Desktop architecture

Use a layered Electron architecture.

Recommended dependency direction:

```text
renderer UI → renderer state/view models → IPC client → main process services → shared domain services
```

Business-critical logic must not live directly inside visual components.

Place reusable domain types and validation logic in shared modules when possible:

```text
desktop/src/shared/domain/
desktop/src/shared/services/
```

Place OS and file-system operations in the Electron main process:

```text
desktop/src/main/services/
```

Renderer code may request file operations through safe IPC APIs only.

### 4.2 Mobile architecture

Use SwiftUI with testable view models and service protocols.

Recommended dependency direction:

```text
SwiftUI View → ViewModel → Service/Repository protocol → concrete implementation
```

Business-critical validation should be implemented in services, not directly in SwiftUI views.

Suggested mobile folders:

```text
mobile/AeroNavCompanion/App/
mobile/AeroNavCompanion/Presentation/
mobile/AeroNavCompanion/Domain/
mobile/AeroNavCompanion/Services/
mobile/AeroNavCompanion/Persistence/
mobile/AeroNavCompanion/Resources/
```

### 4.3 Shared product concepts

Keep the following concepts aligned across desktop and mobile:

- `NavigationPackage`,
- `PackageManifest`,
- `DeviceProfile`,
- `ValidationIssue`,
- `ValidationResult`,
- `DiagnosticsReport`,
- `ExportResult` for desktop only unless mobile needs read-only display.

When changing manifest shape, update both app docs and any fixtures that depend on it.

## 5) Security and Safety Rules

Treat imported packages as untrusted input.

Required safety rules:

- never execute imported package files,
- prevent path traversal on import and export,
- verify exported paths remain inside the selected target directory,
- avoid storing secrets in repository files,
- use mock/demo keys only for signature simulations,
- do not include proprietary aviation data without explicit approval,
- label all demo aviation data as non-operational,
- do not claim certification or operational suitability.

For desktop file operations:

- validate selected source paths,
- validate selected export paths,
- avoid overwriting user files without confirmation,
- write logs and diagnostics deterministically,
- keep destructive operations out of MVP unless explicitly required.

For mobile file import:

- validate file type and size where practical,
- handle invalid JSON gracefully,
- avoid blocking the main thread during parsing or checksum work,
- show actionable errors.

## 6) Documentation, PR Plans, and Changelogs

This repository requires separate documentation history for desktop and mobile.

### 6.1 Desktop changelog

Maintain:

```text
desktop/docs/change.log
```

Update this file for every desktop implementation change.

### 6.2 Mobile changelog

Maintain:

```text
mobile/docs/change.log
```

Update this file for every mobile implementation change.

### 6.3 Desktop PR plans

Maintain:

```text
desktop/docs/PR/
```

For every desktop implementation plan, create a file named:

```text
desktop/docs/PR/YYYY-MM-DD_HHMM_short-plan-name.md
```

### 6.4 Mobile PR plans

Maintain:

```text
mobile/docs/PR/
```

For every mobile implementation plan, create a file named:

```text
mobile/docs/PR/YYYY-MM-DD_HHMM_short-plan-name.md
```

### 6.5 Cross-app plans

If one task changes both desktop and mobile, create one PR-plan file in each app-specific PR directory. The files may share the same timestamp and plan name, but each must describe the impact and validation for its app.

Example:

```text
desktop/docs/PR/2026-06-30_1430_manifest-schema-v1.md
mobile/docs/PR/2026-06-30_1430_manifest-schema-v1.md
```

### 6.6 Changelog entry format

Use this exact format:

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

### 6.7 PR-plan file format

Use this exact format:

```markdown
# <Plan title>

Date: YYYY-MM-DD HH:MM
Scope: desktop | mobile
Branch: feature/<name> | fix/<name> | chore/<name>

## Goal

<What this change is intended to accomplish.>

## Context

<Why the change is needed.>

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

<How to revert or disable the change safely.>
```

## 7) Git and Branch Strategy

Default flow:

```text
feature/fix/chore branch → dev → stage → main
```

Rules:

- create task branches from `dev`,
- branch names must use one of:
  - `feature/*`,
  - `fix/*`,
  - `chore/*`,
- do not commit directly to `main` during routine work,
- keep commits clear, imperative, and scoped,
- commit each significant completed step after related checks pass,
- do not combine unrelated changes in one commit,
- open PRs to `dev`,
- promote `dev` to `stage` only after integration validation,
- promote `stage` to `main` only after integration validation.

If the repository currently only has `main`, create `dev` from the current `main` baseline before adopting this flow.

## 8) Validation Rules

For every change, run targeted validation and report exact outcomes.

### 8.1 Desktop validation tiers

Use the strongest practical tier for the change.

Docs-only:

```text
No build required. Validate markdown readability and links where practical.
```

Routine desktop code:

```text
npm run typecheck
npm run lint
npm run test
```

Desktop release or packaging work:

```text
npm run typecheck
npm run lint
npm run test
npm run build
```

If a script is not defined, report it as skipped rather than silently ignoring it.

### 8.2 Mobile validation tiers

Docs-only:

```text
No build required. Validate markdown readability and links where practical.
```

Routine Swift code:

```text
xcodebuild -list
xcodebuild test -scheme AeroNavCompanion -destination 'platform=iOS Simulator,name=iPhone 16'
```

If the simulator is unavailable, choose an available simulator only after inspecting local Xcode destinations. Report the destination used.

### 8.3 Cross-app validation

For cross-app changes, run applicable desktop and mobile checks. If one app cannot be validated due to environment limitations, classify the blocked validation explicitly and continue only when the risk is acceptable for the task scope.

### 8.4 Failure reporting

For every failed command, report:

- exact command,
- concise error summary,
- blocker type: `environment blocker`, `process blocker`, or `implementation blocker`,
- next required action.

## 9) Implementation Workflow

Before making changes:

1. Identify task scope: desktop, mobile, cross-app, docs-only, or planning-only.
2. Inspect relevant files before editing.
3. Create or update the PR-plan file in the correct `docs/PR/` directory for implementation work.
4. Implement the smallest coherent change.
5. Add or update tests for business logic.
6. Run targeted validation.
7. Update the correct `change.log`.
8. Commit the completed step after validation passes.

Do not mark a task done if changelog and PR-plan requirements are missing.

## 10) Data and Fixture Rules

Use fixtures to make validation and QA scenarios repeatable.

Recommended fixtures:

```text
sample-packages/valid-package/
sample-packages/missing-file/
sample-packages/checksum-mismatch/
sample-packages/expired-cycle/
sample-packages/unsupported-device/
sample-packages/unsigned-package/
```

Each fixture should include a local `README.md` explaining:

- scenario purpose,
- expected validation result,
- expected diagnostics,
- whether the data is generated, public, or derived.

Do not make tests depend on external downloads unless the task explicitly requires integration with an external source.

## 11) Desktop-Specific Rules

Desktop implementation should prioritize:

- package import,
- manifest parsing,
- checksum calculation,
- device profile compatibility,
- removable-media export simulation,
- diagnostics generation,
- operation history,
- QA fixtures.

Do not implement real avionics-device communication unless explicitly requested.

USB/SD support in this demo means:

```text
select target folder → validate writability → create expected folder structure → copy files → verify checksums → write export log
```

It does not mean certified hardware integration.

## 12) Mobile-Specific Rules

Mobile implementation should prioritize:

- SwiftUI package list,
- manifest import through the iOS document workflow,
- validation status display,
- offline validation history,
- diagnostics report review,
- clear empty/loading/error states.

The iOS app is a companion app. It should not duplicate the full desktop export workflow unless explicitly requested.

## 13) AI-Assisted Development Rules

AI tools may be used to accelerate implementation, but the agent is responsible for correctness.

Rules:

- inspect existing code before proposing changes,
- do not invent APIs without checking project dependencies,
- do not claim validation passed unless the command was run successfully,
- keep generated code simple and maintainable,
- prefer explicit domain models over clever abstractions,
- update documentation when architecture or workflow changes.

## 14) Closeout Rules

A task is not complete until:

1. implementation changes are complete,
2. targeted validation has been run or explicitly blocked,
3. relevant `change.log` files are updated,
4. relevant `docs/PR/` plan files exist,
5. changes are committed on the working branch,
6. the branch is pushed unless the user explicitly says not to push,
7. a PR to `dev` is opened unless the user explicitly says not to open one,
8. PR status is reported.

If repository credentials or remote access are unavailable, report the blocker and provide the exact next action.

## 15) Final Message Contract

Every final handoff must include:

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

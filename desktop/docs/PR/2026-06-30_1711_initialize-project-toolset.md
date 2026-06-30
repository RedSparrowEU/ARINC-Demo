# Initialize desktop project toolset

Date: 2026-06-30 17:11
Scope: desktop
Branch: feature/initialize-project-toolset

## Goal

Create a buildable, testable Electron/React/TypeScript foundation for the desktop application.

## Context

The repository currently documents the intended desktop workflow but has no executable project.

## Plan

1. Configure Electron Vite, React, TypeScript, ESLint, Vitest, and npm scripts.
2. Establish isolated main, preload, renderer, and shared-code boundaries.
3. Add a minimal non-operational shell, smoke test, and durable architecture documentation.

## Acceptance criteria

- All documented npm validation scripts pass.
- The production renderer is sandboxed and receives only a restricted preload API.
- The UI clearly states that workflow functionality is not implemented and is non-operational.

## Validation commands

- `npm install`
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`

## Risks

- Dependency updates may require configuration adjustments before the first feature phase.

## Rollback plan

Revert the desktop initialization commit; no persisted data or migrations are introduced.

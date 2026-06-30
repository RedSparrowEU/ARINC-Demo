# Complete desktop Phase 5 route and chart preview

Date: 2026-06-30 22:06
Scope: desktop
Branch: feature/phase-5-previews-companion-bridge

## Goal

Add safe non-operational route and PDF chart previews plus compact companion text generation.

## Context

Phases 1–4 complete the package workflow but do not visualize derived route or chart content.

## Plan

1. Add generated route and PDF fixtures declared by the valid package.
2. Load only declared, size-limited preview files through main-process IPC.
3. Render a simplified route, PDF chart, and compact companion payload with clear disclaimers.

## Acceptance criteria

- Undeclared or invalid preview files are rejected.
- Every preview is visibly labeled non-operational.

## Validation commands

- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`

## Risks

- PDF rendering depends on Electron's built-in PDF viewer.

## Rollback plan

Revert the desktop Phase 5 commit and generated preview fixtures.

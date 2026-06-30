# Guard desktop renderer when the Electron bridge is unavailable

Date: 2026-06-30 22:23
Scope: desktop
Branch: fix/desktop-browser-bridge-guard

## Goal

Prevent the desktop renderer from failing with a raw JavaScript property error when it is rendered without the Electron preload bridge, and keep desktop dev startup working when the shell exports `ELECTRON_RUN_AS_NODE=1`.

## Context

The renderer currently assumes `window.aeronav` always exists. When the page is opened in a regular browser tab or the preload bridge is otherwise unavailable, package import fails with an undefined-property exception instead of an actionable message. The local shell environment also exports `ELECTRON_RUN_AS_NODE=1`, which prevents `npm run dev` from starting a usable Electron window unless the variable is explicitly removed.

## Plan

1. Add a shared helper that reads the optional desktop bridge safely.
2. Guard import and history actions in the renderer and show a direct user-facing message when the bridge is missing.
3. Strip `ELECTRON_RUN_AS_NODE` inside the desktop `dev` script so normal startup opens the Electron window.
4. Add a focused test for missing-bridge detection and rerun desktop validation.

## Acceptance criteria

- The renderer no longer throws a raw `selectAndImportPackage` undefined-property error when the bridge is missing.
- `npm run dev` starts the Electron window even when `ELECTRON_RUN_AS_NODE=1` is present in the shell environment.
- The desktop test suite covers missing-bridge detection.

## Validation commands

- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`

## Risks

- The guard message could mask a deeper preload failure, so it must stay specific to bridge availability rather than general import logic.

## Rollback plan

Revert the desktop bridge-guard commit to restore the previous direct `window.aeronav` calls and the original `dev` script.

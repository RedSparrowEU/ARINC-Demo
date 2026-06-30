# Fix sandboxed Electron preload

Date: 2026-06-30 22:35
Scope: desktop
Branch: fix/sandboxed-preload

## Goal

Restore the Electron desktop bridge so package-folder selection works when the app is launched with `npm run dev`.

## Context

The sandboxed renderer is configured with an ESM preload bundle. Electron executes sandboxed preload scripts as classic scripts, rejects the bundle's `import` statement, and therefore never exposes `window.aeronav`.

## Plan

1. Build the preload bundle as CommonJS and load the matching output file.
2. Remove the browser-only bridge fallback and message from the desktop renderer.
3. Add a focused test for the preload output configuration.
4. Run the complete desktop validation tier and verify Electron starts without a preload error.

## Acceptance criteria

- `npm run dev` loads the preload bridge without a syntax error.
- Selecting a package folder invokes the Electron IPC import workflow.
- The renderer no longer displays instructions about opening the app outside a browser.

## Validation commands

- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`
- `ELECTRON_ENABLE_LOGGING=1 npm run dev`

## Risks

- A preload output filename mismatch would prevent the bridge from loading.

## Rollback plan

Revert the preload build-format, BrowserWindow path, renderer guard removal, and related test changes.

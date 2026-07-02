# Fix desktop ZIP native binding startup crash
Date: 2026-07-03 00:18
Scope: desktop
Branch: fix/desktop-zip-native-binding
## Goal
Restore desktop app startup by making the ZIP extractor a declared dependency instead of relying on Electron's transitive install.
## Context
The ZIP import feature works in source, but the built Electron main bundle can inline the native binding loader from a transitive package and then fail at startup before the app window opens.
## Plan
1. Add `@electron-internal/extract-zip` as a direct desktop dependency at the version already resolved with Electron.
2. Regenerate `desktop/package-lock.json`, then verify the built main bundle resolves the ZIP extractor from `node_modules` instead of inlining the native loader.
3. Run desktop validation plus an Electron dev startup check, then update the desktop changelog.
## Acceptance criteria
- `npm run dev` starts the desktop app without the native-binding crash.
- ZIP import remains available and the built main bundle no longer contains the inlined `Cannot find native binding` loader path.
## Validation commands
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`
- `ELECTRON_ENABLE_LOGGING=1 npm run dev`
## Risks
- Lockfile regeneration may add unrelated package-manager metadata churn.
## Rollback plan
Revert the direct dependency declaration and lockfile update, then restore the prior dependency graph.

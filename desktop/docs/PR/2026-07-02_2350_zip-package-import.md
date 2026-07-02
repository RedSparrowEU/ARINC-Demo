# Add desktop ZIP package import
Date: 2026-07-02 23:50
Scope: desktop
Branch: feature/zip-package-import
## Goal
Allow the desktop app to import AeroNav package ZIP files as well as package folders, then show the same manifest details, validation results, and previews.
## Context
The current desktop import flow only accepts a folder containing `manifest.json`. GPS Demo now exports a ZIP package, so the desktop app needs archive intake at the package-import boundary rather than a separate viewer path.
## Plan
1. Add a main-process archive import service that extracts ZIP files to a temporary workspace, locates the package root, and reuses the existing folder importer.
2. Update the desktop package picker and import/session wiring to accept both directories and `.zip` files while preserving previews, diagnostics, and export from the resolved root.
3. Add automated coverage for ZIP import success and failure paths, then update the desktop changelog.
## Acceptance criteria
- Selecting a `.zip` package imports it successfully and shows manifest details, validation, and previews exactly like a folder import.
- Invalid archives or archives without a discoverable `manifest.json` fail with a structured import error instead of crashing.
## Validation commands
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`
## Risks
- Extracted temporary directories could leak if session lifecycle is not managed carefully.
- Archive root detection could pick the wrong folder if multiple manifests exist in one ZIP.
## Rollback plan
Revert the archive-aware import service and restore the directory-only file picker and tests.

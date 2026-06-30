# Add desktop companion QR and folder memory
Date: 2026-06-30 23:19
Scope: desktop
Branch: feature/companion-qr-folder-memory
## Goal
Generate a scannable companion QR code and remember the last successfully imported package folder.
## Context
The companion action currently emits text only, and the package picker always opens without the previous selection.
## Plan
1. Extract and test compact companion payload and QR generation.
2. Persist the last successful package folder and reuse it as the picker default.
3. Render the QR and compact text together, then update desktop documentation.
## Acceptance criteria
- Generate Companion displays text and a QR encoding the same `AERONAV1:` payload.
- The next package picker opens at the last successfully imported accessible folder.
- Missing or corrupt persisted folder state falls back safely.
## Validation commands
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`
## Risks
- QR payload size or persisted path corruption could prevent display or picker reuse.
## Rollback plan
Revert the feature commit to restore text-only generation and the default package picker.

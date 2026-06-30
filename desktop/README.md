# AeroNav Update Console

Electron/macOS application for the non-operational AeroNav package workflow demo. Phase 1 supports
safe folder selection, manifest parsing, package metadata and file-tree display, SHA-256 verification,
and deterministic validation reporting.

Device compatibility, archive import, export, diagnostics, and operation history are not implemented.
Phase 2 adds selectable fictional device profiles and compatibility checks; archive import, export,
diagnostics, and operation history remain unimplemented.

## Requirements

- Node.js 22 or later
- npm 11 or later

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run test
npm run build
```

See [architecture](docs/architecture.md) and [validation](docs/validation.md) for project rules.

# Desktop validation

Run from `desktop/`:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

Unit tests belong under `tests/` or beside framework-independent services. Future file-system tests
must use temporary directories and cover path traversal, checksum failures, missing files, and
post-copy verification without depending on external downloads.

## Phase 1 rules

- Required manifest fields must have the documented types and non-empty values.
- Package IDs use `ANAV-<four-digit-cycle>-<uppercase-region>-<uppercase-device-code>`.
- Effective dates use real `YYYY-MM-DD` values, must be ordered, and must not be expired.
- A future effective date is a warning; expiration is blocking.
- Declared paths must use safe relative POSIX syntax and may not traverse or resolve outside the root.
- Declared symbolic links are blocking and are never followed.
- Missing required files and checksum mismatches are blocking; missing optional files are warnings.
- Any error or blocking issue yields `failed`; warning-only results yield `warning`; otherwise `valid`.

Device compatibility, signature requirements, export checks, and post-export verification begin in
later roadmap phases and are intentionally excluded.

Phase 2 compatibility validates selected target identity, region, declared categories, optional
manifest media type, signing requirements, and total package size against checked-in demo profiles.

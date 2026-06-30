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

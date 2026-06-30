# Mobile validation

Run from `mobile/`:

```bash
xcodebuild -list -project AeroNavCompanion.xcodeproj
xcodebuild test -project AeroNavCompanion.xcodeproj -scheme AeroNavCompanion \
  -destination 'platform=iOS Simulator,name=iPhone 17 Pro,OS=26.0.1'
```

If this destination is unavailable, inspect `xcrun simctl list devices available`, select an
installed iPhone simulator, and report the exact destination used. Future tests must cover decoding,
validation mapping, persistence, diagnostics decoding, and view-model state transitions.

Phase 1 unit coverage verifies representative valid/warning/failed samples, injected list data,
metadata and effective-period presentation, deterministic category grouping, file sorting, and empty
package contents. Statuses are static display values until Phase 2 introduces manifest import.

Phase 2 validates decoded required fields, identity, dates, safe paths, and checksum syntax. It does
not claim checksum verification because a manifest-only import cannot access declared package files.
Phase 3 history tests cover atomic round-trip, newest-first ordering, and 100-entry retention.
Phase 4 accepts diagnostics schema version 1 and orders groups blocking, error, warning, then info.

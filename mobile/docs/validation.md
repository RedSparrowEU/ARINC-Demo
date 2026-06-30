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

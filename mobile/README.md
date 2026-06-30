# AeroNav Companion

Native SwiftUI companion for reviewing non-operational AeroNav package information. Phase 1 presents
three representative package states and navigates to metadata, effective dates, status, and files
grouped by category.

The sample statuses are display data. Document import, manifest decoding, mobile validation,
history, and diagnostics parsing are not implemented.
Phase 2 imports JSON manifests through the document picker and keeps results in memory. Offline
history and diagnostics remain unimplemented.
Phase 3 stores the newest 100 validation attempts offline in an atomic versioned JSON file.
Phase 4 imports desktop `diagnostics-report.json` files and groups issues with suggested actions.
Phase 5 adds optional `AERONAV1` text decoding and automatic VisionKit QR scanning on supported
physical devices. Unsupported environments keep the reader action visible with an availability message.

## Requirements

- Xcode 26 or later
- An iOS 18 or later simulator

## Commands

```bash
make run

xcodebuild -list -project AeroNavCompanion.xcodeproj
xcodebuild test -project AeroNavCompanion.xcodeproj -scheme AeroNavCompanion \
  -destination 'platform=iOS Simulator,name=iPhone 17 Pro,OS=26.0.1'
```

`make run` boots, builds, installs, and launches the app on `iPhone 17 Pro`. To use another
installed simulator, run `make run SIMULATOR='iPhone 16 Pro'`. List available devices with
`xcrun simctl list devices available`.

See [architecture](docs/architecture.md) and [validation](docs/validation.md) for project rules.

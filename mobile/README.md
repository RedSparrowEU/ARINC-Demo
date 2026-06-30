# AeroNav Companion

Native SwiftUI companion shell for reviewing non-operational AeroNav package information. The
initial scaffold provides architectural seams and a sample list only; manifest import, validation,
history, and diagnostics parsing are not yet implemented.

## Requirements

- Xcode 26 or later
- An iOS 18 or later simulator

## Commands

```bash
xcodebuild -list -project AeroNavCompanion.xcodeproj
xcodebuild test -project AeroNavCompanion.xcodeproj -scheme AeroNavCompanion \
  -destination 'platform=iOS Simulator,name=iPhone 17 Pro,OS=26.0.1'
```

See [architecture](docs/architecture.md) and [validation](docs/validation.md) for project rules.

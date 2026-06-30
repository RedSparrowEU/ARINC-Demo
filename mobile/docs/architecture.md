# Mobile architecture

The companion app follows a testable SwiftUI dependency direction:

```text
SwiftUI view → observable view model → service/repository protocol → concrete implementation
```

- `App/` owns the application entry point and dependency composition.
- `Presentation/` owns SwiftUI views and main-actor view models.
- `Domain/` owns platform-light product concepts.
- `Services/` owns asynchronous import and future validation adapters.
- `Persistence/` owns validation-history storage implementations.
- `Resources/` owns previews and clearly labeled generated demo data.

Phase 1 sample models live in `Resources/SamplePackages.swift`, outside SwiftUI views. The list view
model owns the displayed package collection, while the details view model groups and sorts files and
formats the effective period. Views only render those states and navigation.

File parsing and checksum work must remain off the main actor when introduced. Phase 1 intentionally
does not define a production manifest decoder or validation contract.

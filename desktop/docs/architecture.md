# Desktop architecture

The desktop app uses isolated Electron layers:

```text
React renderer → typed preload API → Electron main process → file-system services
                                  ↘ shared domain and validation services
```

- `src/main/` owns windows, IPC registration, operating-system access, and future file operations.
- `src/preload/` exposes the smallest possible typed API through `contextBridge`.
- `src/renderer/` owns React presentation and view state; it has no Node.js access.
- `src/shared/domain/` and `src/shared/services/` contain framework-independent rules.

The BrowserWindow enables context isolation and sandboxing and disables renderer Node integration.
Imported package files will be treated as untrusted and never executed. The scaffold intentionally
does not define the production manifest schema or validation API.

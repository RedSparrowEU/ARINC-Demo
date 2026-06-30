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
The preload exposes one Phase 1 operation: `selectAndImportPackage()`. It returns cancellation, a
structured import failure, or an imported package containing manifest metadata, a read-only file
tree, calculated checksums, and validation issues. Full source paths are not exposed to the renderer.

Imported package files are treated as untrusted and never executed. The main process rejects unsafe
declared paths and declared symlinks, does not follow symlinks while constructing the tree, and
confines checksum work to regular files under the selected package root.

Device profiles and compatibility rules are shared, pure modules. The renderer can revalidate a
selected profile without filesystem IPC or rereading the package.
Phase 3 keeps source paths behind opaque session IDs and performs staged export and verification in the main process.

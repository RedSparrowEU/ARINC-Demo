import { useState } from 'react'
import type { FileTreeNode, ImportedPackage } from '@shared/domain/imported-package'
import type { ValidationIssue } from '@shared/domain/validation-result'
import { matchingDeviceProfile, validateDeviceCompatibility } from '@shared/services/device-compatibility-validator'

type ScreenState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'failed'; message: string; issues: ValidationIssue[] }
  | { kind: 'completed'; package: ImportedPackage }

export function App(): React.JSX.Element {
  const [state, setState] = useState<ScreenState>({ kind: 'idle' })

  async function selectPackage(): Promise<void> {
    setState({ kind: 'loading' })
    try {
      const result = await window.aeronav.selectAndImportPackage()
      if (result.kind === 'cancelled') setState({ kind: 'idle' })
      else if (result.kind === 'failed') setState(result)
      else setState({ kind: 'completed', package: result.package })
    } catch (error) {
      setState({
        kind: 'failed',
        message: error instanceof Error ? error.message : 'Package import failed.',
        issues: []
      })
    }
  }

  return (
    <main>
      <header className="masthead">
        <div>
          <p className="eyebrow">NON-OPERATIONAL DEMO</p>
          <h1>AeroNav Update Console</h1>
          <p className="summary">Import a demo package folder, verify its manifest and checksums, and review deterministic validation results.</p>
        </div>
        <button onClick={() => void selectPackage()} disabled={state.kind === 'loading'}>
          {state.kind === 'loading' ? 'Validating…' : state.kind === 'completed' ? 'Choose another folder' : 'Select package folder'}
        </button>
      </header>

      {state.kind === 'idle' && <EmptyState />}
      {state.kind === 'loading' && <section className="panel"><p>Reading untrusted package contents and calculating SHA-256 checksums…</p></section>}
      {state.kind === 'failed' && <FailureState message={state.message} issues={state.issues} />}
      {state.kind === 'completed' && <PackageReport importedPackage={state.package} />}
    </main>
  )
}

function EmptyState(): React.JSX.Element {
  return (
    <section className="panel empty-state">
      <h2>No package selected</h2>
      <p>Select a folder containing <code>manifest.json</code>. Archive import and device compatibility are outside Phase 1.</p>
    </section>
  )
}

function FailureState({ message, issues }: { message: string; issues: ValidationIssue[] }): React.JSX.Element {
  return (
    <section className="panel failure" role="alert">
      <p className="status failed">Import failed</p>
      <h2>{message}</h2>
      {issues.length > 0 && <IssueList issues={issues} />}
    </section>
  )
}

function PackageReport({ importedPackage }: { importedPackage: ImportedPackage }): React.JSX.Element {
  const { manifest, validation, tree } = importedPackage
  const profiles = window.aeronav.getDeviceProfiles()
  const initial = matchingDeviceProfile(manifest, profiles)
  const [profileId, setProfileId] = useState(initial?.id ?? '')
  const profile = profiles.find((item) => item.id === profileId)
  const packageSize = treeSize(tree)
  const compatibility = validateDeviceCompatibility(manifest, profile, packageSize)
  const readiness = validation.status === 'failed' || compatibility.status === 'failed' ? 'failed' : validation.status === 'warning' || compatibility.status === 'warning' ? 'warning' : 'valid'
  return (
    <div className="report-grid">
      <section className="panel summary-panel">
        <div className="section-heading">
          <div><p className="kicker">{importedPackage.rootName}</p><h2>{manifest.packageId}</h2></div>
          <span className={`status ${validation.status}`}>{validation.status}</span>
        </div>
        <dl className="metadata">
          <div><dt>Provider</dt><dd>{manifest.provider}</dd></div>
          <div><dt>Source</dt><dd>{manifest.source}</dd></div>
          <div><dt>Cycle</dt><dd>{manifest.cycle}</dd></div>
          <div><dt>Region</dt><dd>{manifest.region}</dd></div>
          <div><dt>Target device</dt><dd>{manifest.targetDevice}</dd></div>
          <div><dt>Effective</dt><dd>{manifest.effectiveFrom} — {manifest.effectiveTo}</dd></div>
        </dl>
      </section>
      <section className="panel summary-panel">
        <div className="section-heading"><h2>Device compatibility</h2><span className={`status ${readiness}`}>overall {readiness}</span></div>
        <label>Target device <select value={profileId} onChange={(event) => setProfileId(event.target.value)}><option value="">Select device</option>{profiles.map((item)=><option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        {profile && <dl className="metadata"><div><dt>Media</dt><dd>{profile.mediaType}</dd></div><div><dt>Root folder</dt><dd>{profile.requiredRootFolder}</dd></div><div><dt>Regions</dt><dd>{profile.supportedRegions.join(', ')}</dd></div><div><dt>Required categories</dt><dd>{profile.requiredCategories.join(', ')}</dd></div><div><dt>Signing</dt><dd>{profile.requiresSignedPackages?'Required':'Not required'}</dd></div><div><dt>Maximum size</dt><dd>{profile.maxPackageSizeMb} MB</dd></div></dl>}
        {compatibility.issues.length ? <IssueList issues={compatibility.issues}/>:<p className="success-copy">Device compatibility passed.</p>}
      </section>

      <section className="panel">
        <div className="section-heading"><h2>Validation report</h2><span>{validation.issues.length} issues</span></div>
        {validation.issues.length === 0 ? <p className="success-copy">All Phase 1 checks passed.</p> : <IssueList issues={validation.issues} />}
      </section>

      <section className="panel">
        <div className="section-heading"><h2>Declared files</h2><span>{validation.files.length}</span></div>
        <div className="file-results">
          {validation.files.map((file) => (
            <article key={file.path}>
              <div><strong>{file.path}</strong><small>{file.category} · {file.required ? 'required' : 'optional'}</small></div>
              <span className={`checksum ${file.checksumMatches ? 'match' : file.exists ? 'mismatch' : 'missing'}`}>
                {file.checksumMatches ? 'checksum verified' : file.exists ? 'checksum failed' : 'missing'}
              </span>
              {file.calculatedSha256 && <code title={file.calculatedSha256}>{file.calculatedSha256}</code>}
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="section-heading"><h2>Package file tree</h2><span>read-only</span></div>
        <FileTree nodes={tree} />
      </section>
    </div>
  )
}

function treeSize(nodes:FileTreeNode[]):number { return nodes.reduce((total,node)=>total+(node.size??0)+treeSize(node.children??[]),0) }

function IssueList({ issues }: { issues: ValidationIssue[] }): React.JSX.Element {
  return <ul className="issues">{issues.map((issue, index) => <li key={`${issue.code}-${issue.path ?? index}`}><span className={`severity ${issue.severity}`}>{issue.severity}</span><div>{issue.message}{issue.path && <code>{issue.path}</code>}</div></li>)}</ul>
}

function FileTree({ nodes }: { nodes: FileTreeNode[] }): React.JSX.Element {
  return <ul className="file-tree">{nodes.map((node) => <li key={node.relativePath}><span>{node.type === 'directory' ? '▾' : node.type === 'symlink' ? '↗' : '•'} {node.name}</span>{node.children && <FileTree nodes={node.children} />}</li>)}</ul>
}

import { useState } from 'react'
import type { FileTreeNode, ImportedPackage } from '@shared/domain/imported-package'
import type { ValidationIssue } from '@shared/domain/validation-result'
import { matchingDeviceProfile, validateDeviceCompatibility } from '@shared/services/device-compatibility-validator'
import type{OperationHistoryRecord}from'@shared/domain/diagnostics-report'
import type{RoutePreview}from'@shared/domain/preview'
import {
  DESKTOP_BRIDGE_UNAVAILABLE_MESSAGE,
  getOptionalBridge
} from '@shared/desktop-bridge'

type ScreenState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'failed'; message: string; issues: ValidationIssue[] }
  | { kind: 'completed'; package: ImportedPackage }

export function App(): React.JSX.Element {
  const desktopApi = getOptionalBridge(window)
  const [state, setState] = useState<ScreenState>({ kind: 'idle' })
  const [history,setHistory]=useState<OperationHistoryRecord[]>([])

  async function selectPackage(): Promise<void> {
    if (!desktopApi) {
      setState({
        kind: 'failed',
        message: DESKTOP_BRIDGE_UNAVAILABLE_MESSAGE,
        issues: []
      })
      return
    }
    setState({ kind: 'loading' })
    try {
      const result = await desktopApi.selectAndImportPackage()
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
        <button
          onClick={() => {
            if (!desktopApi) {
              setState({
                kind: 'failed',
                message: DESKTOP_BRIDGE_UNAVAILABLE_MESSAGE,
                issues: []
              })
              return
            }
            void desktopApi.getOperationHistory().then(setHistory)
          }}
        >
          Load history
        </button>
      </header>

      {state.kind === 'idle' && <EmptyState hasDesktopBridge={Boolean(desktopApi)} />}
      {state.kind === 'loading' && <section className="panel"><p>Reading untrusted package contents and calculating SHA-256 checksums…</p></section>}
      {state.kind === 'failed' && <FailureState message={state.message} issues={state.issues} />}
      {state.kind === 'completed' && desktopApi && <PackageReport importedPackage={state.package} desktopApi={desktopApi} />}
      {history.length>0&&<section className="panel"><h2>Operation history</h2>{history.map(item=><p key={item.id}>{item.attemptedAt} · {item.type} · {item.status} · {item.summary}</p>)}</section>}
    </main>
  )
}

function EmptyState({ hasDesktopBridge }: { hasDesktopBridge: boolean }): React.JSX.Element {
  return (
    <section className="panel empty-state">
      <h2>No package selected</h2>
      <p>Select a folder containing <code>manifest.json</code>. Archive import and device compatibility are outside Phase 1.</p>
      {!hasDesktopBridge && <p>{DESKTOP_BRIDGE_UNAVAILABLE_MESSAGE}</p>}
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

function PackageReport({
  importedPackage,
  desktopApi
}: {
  importedPackage: ImportedPackage
  desktopApi: NonNullable<ReturnType<typeof getOptionalBridge<typeof window.aeronav>>>
}): React.JSX.Element {
  const { manifest, validation, tree } = importedPackage
  const profiles = desktopApi.getDeviceProfiles()
  const initial = matchingDeviceProfile(manifest, profiles)
  const [profileId, setProfileId] = useState(initial?.id ?? '')
  const profile = profiles.find((item) => item.id === profileId)
  const packageSize = treeSize(tree)
  const compatibility = validateDeviceCompatibility(manifest, profile, packageSize)
  const readiness = validation.status === 'failed' || compatibility.status === 'failed' ? 'failed' : validation.status === 'warning' || compatibility.status === 'warning' ? 'warning' : 'valid'
  const [exportMessage,setExportMessage]=useState('')
  const [route,setRoute]=useState<RoutePreview>();const[chart,setChart]=useState<string>();const previewPath=manifest.files.find(f=>f.path.endsWith('route-preview.json'))?.path;const chartPath=manifest.files.find(f=>f.category==='charts'&&f.path.toLowerCase().endsWith('.pdf'))?.path
  const [bridgeText,setBridgeText]=useState('')
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
        <button disabled={readiness==='failed'||!profile||!importedPackage.sessionId} onClick={()=>{if(profile&&importedPackage.sessionId)void desktopApi.exportPackage({profileId:profile.id,sessionId:importedPackage.sessionId}).then(result=>setExportMessage(result.kind==='success'?`Exported to ${result.destination}`:result.kind==='failed'?result.message:'Export cancelled'))}}>Export to folder</button>
        <button disabled={!importedPackage.sessionId} onClick={()=>{if(importedPackage.sessionId)void desktopApi.saveDiagnostics(importedPackage.sessionId).then(saved=>setExportMessage(saved?'Diagnostics saved':'Diagnostics save cancelled'))}}>Save diagnostics</button>
        {exportMessage&&<p>{exportMessage}</p>}
      </section>

      <section className="panel">
        <div className="section-heading"><h2>Validation report</h2><span>{validation.issues.length} issues</span></div>
        {validation.issues.length === 0 ? <p className="success-copy">All Phase 1 checks passed.</p> : <IssueList issues={validation.issues} />}
      </section>
      {(previewPath||chartPath)&&<section className="panel summary-panel"><div className="section-heading"><h2>Non-operational previews</h2><span>demo visualization only</span></div>{previewPath&&<button onClick={()=>{if(importedPackage.sessionId)void desktopApi.loadRoutePreview(importedPackage.sessionId,previewPath).then(r=>{if(r.kind==='success')setRoute(r.value)})}}>Load route preview</button>}{chartPath&&<button onClick={()=>{if(importedPackage.sessionId)void desktopApi.loadChartPreview(importedPackage.sessionId,chartPath).then(r=>{if(r.kind==='success')setChart(r.value)})}}>Load PDF chart</button>}{route&&<RouteMap route={route}/>} {chart&&<iframe className="chart-preview" title="Non-operational demo chart" src={chart}/>}</section>}
      <section className="panel summary-panel"><div className="section-heading"><h2>Optional companion bridge</h2><span>compact text / QR payload</span></div><button onClick={()=>{const issues=[...validation.issues,...compatibility.issues];const payload={packageId:manifest.packageId,status:readiness,generatedAt:new Date().toISOString(),summary:`${issues.length} issues`,blocking:issues.filter(i=>i.severity==='blocking').length,warning:issues.filter(i=>i.severity==='warning').length};setBridgeText(`AERONAV1:${btoa(JSON.stringify(payload)).replaceAll('+','-').replaceAll('/','_').replaceAll('=','')}`)}}>Generate companion text</button>{bridgeText&&<textarea readOnly value={bridgeText} rows={5} aria-label="Compact companion summary"/>}</section>

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
function RouteMap({route}:{route:RoutePreview}):React.JSX.Element{const lats=route.points.map(p=>p.latitude),lons=route.points.map(p=>p.longitude),minLat=Math.min(...lats),maxLat=Math.max(...lats),minLon=Math.min(...lons),maxLon=Math.max(...lons);const xy=(lat:number,lon:number)=>`${20+((lon-minLon)/(maxLon-minLon||1))*560},${20+((maxLat-lat)/(maxLat-minLat||1))*260}`;return <div><h3>{route.name}</h3><svg viewBox="0 0 600 300" role="img" aria-label="Simplified non-operational route"><polyline points={route.points.map(p=>xy(p.latitude,p.longitude)).join(' ')} fill="none" stroke="#64d3c6" strokeWidth="4"/>{route.points.map(p=>{const [x,y]=xy(p.latitude,p.longitude).split(',');return <g key={p.id}><circle cx={x} cy={y} r="7" fill="#ffd37a"/><text x={Number(x)+10} y={Number(y)-10} fill="white">{p.id}</text></g>})}</svg></div>}

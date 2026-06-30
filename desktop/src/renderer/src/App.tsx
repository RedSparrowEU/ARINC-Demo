import { productInfo } from '@shared/domain/product-info'

export function App(): React.JSX.Element {
  return (
    <main>
      <p className="eyebrow">NON-OPERATIONAL DEMO</p>
      <h1>{productInfo.name}</h1>
      <p className="summary">
        A buildable foundation for package import, deterministic validation, removable-media export
        simulation, and diagnostics.
      </p>
      <section aria-labelledby="status-heading">
        <h2 id="status-heading">Initialization status</h2>
        <dl>
          <div><dt>Desktop runtime</dt><dd>Electron on {window.aeronav.platform}</dd></div>
          <div><dt>Package workflow</dt><dd>Not implemented</dd></div>
          <div><dt>Operational suitability</dt><dd>None — demonstration only</dd></div>
        </dl>
      </section>
    </main>
  )
}

import './FeatureTemplate.css'

/**
 * Shared template for feature comparison pages
 *
 * @param {Object} props
 * @param {string} props.title - Feature title
 * @param {string} props.before - Name of the JS library being replaced
 * @param {string} props.after - Name of the CSS feature replacing it
 * @param {string} props.description - Description of what this feature does
 * @param {React.ReactNode} [props.beforeDemo] - Live demo of the "before" approach
 * @param {React.ReactNode} [props.afterDemo] - Live demo of the "after" approach
 * @param {string} [props.beforeCode] - Code snippet for the "before" approach
 * @param {string} [props.afterCode] - Code snippet for the "after" approach
 * @param {Object} [props.costs] - Measured costs
 * @param {string} [props.costs.beforeSize] - Bundle size before
 * @param {string} [props.costs.afterSize] - Bundle size after
 * @param {string} [props.costs.beforeINP] - INP cost before
 * @param {string} [props.costs.afterINP] - INP cost after
 * @param {string} [props.costs.note] - How the figures were measured, and what they leave out
 * @param {Object} [props.browserSupport] - Browser support info
 * @param {string} [props.browserSupport.chrome] - Chrome version
 * @param {string} [props.browserSupport.firefox] - Firefox version
 * @param {string} [props.browserSupport.safari] - Safari version
 * @param {import('react').ReactNode} [props.browserSupport.note] - Caveats the version grid cannot show
 * @param {import('react').ReactNode} [props.verdict] - Honest assessment of whether it's worth it
 */
export function FeatureTemplate({
  title,
  before,
  after,
  description,
  beforeDemo,
  afterDemo,
  beforeCode,
  afterCode,
  costs,
  browserSupport,
  verdict,
}) {
  return (
    <article className="feature-page">
      <header className="feature-header section">
        <div className="container content-narrow">
          <h1 className="feature-page-title">{title}</h1>
          <p className="feature-description">{description}</p>
          <div className="feature-meta">
            <div className="meta-item">
              <span className="meta-label">Replaces</span>
              <code className="meta-value">{before}</code>
            </div>
            <div className="meta-item">
              <span className="meta-label">Uses</span>
              <code className="meta-value">{after}</code>
            </div>
          </div>
        </div>
      </header>

      {/* Before / After Comparison */}
      <section className="comparison-section section">
        <div className="container">
          <div className="comparison-grid">
            {/* Before */}
            <div className="comparison-panel">
              <h2 className="comparison-heading">
                <span className="badge">Before</span>
                {before}
              </h2>
              {beforeDemo && (
                <div className="demo-container">
                  <div className="demo-label">Live Demo</div>
                  <div className="demo-content">{beforeDemo}</div>
                </div>
              )}
              {!beforeDemo && (
                <div className="demo-placeholder">
                  <p>TODO: Live demo of {before} implementation</p>
                </div>
              )}
              {beforeCode && (
                <div className="code-container">
                  <div className="code-label">Code</div>
                  <pre>
                    <code>{beforeCode}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* After */}
            <div className="comparison-panel comparison-panel-highlight">
              <h2 className="comparison-heading">
                <span className="badge badge-accent">After</span>
                {after}
              </h2>
              {afterDemo && (
                <div className="demo-container">
                  <div className="demo-label">Live Demo</div>
                  <div className="demo-content">{afterDemo}</div>
                </div>
              )}
              {!afterDemo && (
                <div className="demo-placeholder">
                  <p>TODO: Live demo of CSS-only implementation using {after}</p>
                </div>
              )}
              {afterCode && (
                <div className="code-container">
                  <div className="code-label">Code</div>
                  <pre>
                    <code>{afterCode}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Measured Costs */}
      <section className="costs-section section">
        <div className="container content-narrow">
          <h2 className="section-heading">Measured Costs</h2>
          {costs ? (
            <>
              <div className="costs-grid">
                <div className="cost-item">
                  <div className="cost-label">Bundle Size</div>
                  <div className="cost-comparison">
                    <span className="cost-before">{costs.beforeSize}</span>
                    <span className="cost-arrow">→</span>
                    <span className="cost-after">{costs.afterSize}</span>
                  </div>
                </div>
                <div className="cost-item">
                  <div className="cost-label">INP Impact</div>
                  <div className="cost-comparison">
                    <span className="cost-before">{costs.beforeINP}</span>
                    <span className="cost-arrow">→</span>
                    <span className="cost-after">{costs.afterINP}</span>
                  </div>
                </div>
              </div>
              {costs.note && <p className="section-note">{costs.note}</p>}
            </>
          ) : (
            <p className="placeholder-text">
              TODO: Measure and compare bundle size, main-thread time, and INP
            </p>
          )}
        </div>
      </section>

      {/* Browser Support */}
      <section className="browser-support-section section">
        <div className="container content-narrow">
          <h2 className="section-heading">Browser Support</h2>
          {browserSupport ? (
            <div className="browser-grid">
              <div className="browser-item">
                <span className="browser-name">Chrome</span>
                <span className="browser-version">{browserSupport.chrome}</span>
              </div>
              <div className="browser-item">
                <span className="browser-name">Firefox</span>
                <span className="browser-version">{browserSupport.firefox}</span>
              </div>
              <div className="browser-item">
                <span className="browser-name">Safari</span>
                <span className="browser-version">{browserSupport.safari}</span>
              </div>
            </div>
          ) : null}
          {browserSupport?.note && <p className="section-note">{browserSupport.note}</p>}
          {!browserSupport && (
            <p className="placeholder-text">
              TODO: Document browser support and required fallbacks
            </p>
          )}
        </div>
      </section>

      {/* Verdict */}
      <section className="verdict-section section">
        <div className="container content-narrow">
          <h2 className="section-heading">Is it worth it?</h2>
          {verdict ? (
            <div className="verdict-content">
              {typeof verdict === 'string' ? <p>{verdict}</p> : verdict}
            </div>
          ) : (
            <p className="placeholder-text">
              TODO: Honest verdict on complexity vs. performance trade-off
            </p>
          )}
        </div>
      </section>
    </article>
  )
}

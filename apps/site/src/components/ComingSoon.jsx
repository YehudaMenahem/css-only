import './ComingSoon.css'

/**
 * Stand-in for a feature page whose comparison is not written yet.
 * Server Component: no state, effects, or event handlers.
 *
 * @param {Object} props
 * @param {string} props.title - Feature title
 * @param {string} props.before - Name of the JS library being replaced
 * @param {string} props.after - Name of the CSS feature replacing it
 * @param {string} props.description - Description of what this feature does
 * @param {string} [props.lead] - Shorter lead shown on small screens instead of description
 */
export function ComingSoon({ title, before, after, description, lead }) {
  return (
    <article className={`coming-soon${lead ? ' has-lead' : ''}`}>
      <div className="container">
        <div className="coming-soon-inner">
          <p className="coming-soon-kicker">
            <span className="badge badge-accent">Coming soon</span>
          </p>
          <h1 className="coming-soon-title">{title}</h1>
          {lead ? <p className="coming-soon-lead">{lead}</p> : null}
          <p className="coming-soon-description">{description}</p>
          <dl className="coming-soon-meta">
            <div className="coming-soon-meta-item coming-soon-meta-before">
              <dt>Replaces</dt>
              <dd>
                <code>{before}</code>
              </dd>
            </div>
            <div className="coming-soon-meta-item coming-soon-meta-after">
              <dt>Uses</dt>
              <dd>
                <code>{after}</code>
              </dd>
            </div>
          </dl>
          <p className="coming-soon-note">
            The live comparison is not published yet. Demos, measured costs, browser support, and
            the verdict will land on this page.
          </p>
          <a className="coming-soon-back" href="/">
            Back to the showcase
          </a>
        </div>
      </div>
    </article>
  )
}

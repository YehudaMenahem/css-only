import { CopyCodeButton } from './CopyCodeButton'

/**
 * Feature-page code snippet: collapsed with details/summary on small screens.
 * Desktop keeps the code visible via CSS (no JS). Copy is progressive enhancement.
 *
 * @param {Object} props
 * @param {string} props.code - Source to display and copy
 * @param {string} [props.label='Code'] - Summary / toolbar label
 */
export function CodeBlock({ code, label = 'Code' }) {
  return (
    <div className="code-container">
      <details className="code-block">
        <summary className="code-summary">
          <span className="code-summary-label">{label}</span>
          <CopyCodeButton text={code} />
        </summary>
        <pre>
          <code>{code}</code>
        </pre>
      </details>
    </div>
  )
}

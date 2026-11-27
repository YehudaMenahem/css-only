import { CopyCodeButton } from './CopyCodeButton'

/**
 * Feature-page code snippet.
 * Mobile: collapsed with details/summary. Desktop: always visible (separate
 * markup — closed details content stays a11y-hidden in Chromium even when
 * display is overridden, so one details element cannot serve both).
 * Copy is progressive enhancement via Clipboard API.
 *
 * @param {Object} props
 * @param {string} props.code - Source to display and copy
 * @param {string} [props.label='Code'] - Summary / toolbar label
 */
export function CodeBlock({ code, label = 'Code' }) {
  return (
    <div className="code-container">
      <div className="code-block code-block-desktop">
        <div className="code-toolbar">
          <span className="code-summary-label">{label}</span>
          <CopyCodeButton text={code} />
        </div>
        <pre>
          <code>{code}</code>
        </pre>
      </div>

      <details className="code-block code-block-mobile">
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

'use client'

import { useState, type MouseEvent } from 'react'

type CopyCodeButtonProps = {
  text: string
}

/**
 * Progressive enhancement: copies code via the Clipboard API.
 * Lives in apps/site only — never in the kit or "after" demos.
 * Harmless when the API is missing; the code stays selectable.
 */
export function CopyCodeButton({ text }: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleClick(event: MouseEvent<HTMLButtonElement>) {
    // Keep the surrounding details/summary from toggling.
    event.preventDefault()
    event.stopPropagation()

    if (!navigator.clipboard?.writeText) return

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Permission denied or other failure: leave the label unchanged.
    }
  }

  return (
    <button
      type="button"
      className="copy-code-button"
      onClick={handleClick}
      aria-label={copied ? 'Copied' : 'Copy code'}
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

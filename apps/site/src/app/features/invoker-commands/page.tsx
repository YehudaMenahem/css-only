import type { Metadata } from 'next'
import { Modal } from 'css-only-kit'
import 'css-only-kit/Modal.css'
import { FeatureTemplate } from '@/components/FeatureTemplate'
import { StatefulDialog } from './StatefulDialog'
import './page.css'

const beforeCode = `'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

type StatefulDialogProps = {
  id: string
  trigger: string
  children: ReactNode
}

export function StatefulDialog({ id, trigger, children }: StatefulDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <>
      <button type="button" className="demo-trigger" onClick={() => setOpen(true)}>
        {trigger}
      </button>
      <dialog ref={dialogRef} id={id} onClose={() => setOpen(false)}>
        <div className="modal-content">{children}</div>
        <button
          type="button"
          className="modal-close"
          aria-label="Close"
          onClick={() => setOpen(false)}
        >
          ×
        </button>
      </dialog>
    </>
  )
}`

const afterCode = `import { Modal } from 'css-only-kit'
import 'css-only-kit/Modal.css'

export default function Example() {
  return (
    <Modal
      id="invoker-dialog"
      trigger="Open with HTML"
      triggerClassName="demo-trigger demo-trigger-accent"
    >
      <h2>Opened with invoker commands</h2>
      <p className="dialog-copy">
        command="show-modal" opens this dialog in the browser.
      </p>
    </Modal>
  )
}

/* Markup Modal renders. No handlers, no "use client". */
<button type="button" commandfor="invoker-dialog" command="show-modal">
  Open with HTML
</button>
<dialog id="invoker-dialog" closedby="any">
  <button
    type="button"
    commandfor="invoker-dialog"
    command="close"
    aria-label="Close"
  >
    ×
  </button>
</dialog>`

export default function InvokerCommandsPage() {
  return (
    <FeatureTemplate
      title="Modal & Dialog"
      before="useState / Radix Dialog"
      after="commandfor + command + closedby"
      description="Open, close, focus, and Escape, with the behavior in the HTML. The same job as a useState modal or Radix Dialog, without a client component."
      beforeDemo={
        <div className="dialog-demo">
          <StatefulDialog id="state-dialog" trigger="Open with JavaScript">
            <h2>Opened with useState</h2>
            <p className="dialog-copy">
              A click handler set state, then an effect called showModal(). Close with the button or
              Escape. A backdrop click does nothing: that takes more script.
            </p>
          </StatefulDialog>
          <p className="dialog-demo-note">
            Client Component. This button works after the file hydrates. It is the small version of
            the pattern. The bundle figure below is Radix Dialog, which is what teams usually ship
            instead.
          </p>
        </div>
      }
      afterDemo={
        <div className="dialog-demo">
          <Modal
            id="invoker-dialog"
            trigger="Open with HTML"
            triggerClassName="demo-trigger demo-trigger-accent"
          >
            <h2>Opened with invoker commands</h2>
            <p className="dialog-copy">
              The button carries commandfor and command=&quot;show-modal&quot;. React does not
              handle the click. Close with the button, Escape, or a backdrop click where closedby is
              supported.
            </p>
          </Modal>
          <p className="dialog-demo-note">
            Server Component. This button is ordinary HTML, so it works before any JavaScript loads.
            Backdrop dismiss is closedby=&quot;any&quot;, which stable Safari does not implement
            yet.
          </p>
        </div>
      }
      beforeCode={beforeCode}
      afterCode={afterCode}
      costs={{
        beforeSize: 'Radix 12.9 KB',
        afterSize: '0 KB JS',
        beforeINP: 'after hydration',
        afterINP: 'no React work',
        note: '12.9 KB is Bundlephobia’s minified-and-gzipped size for @radix-ui/react-dialog 1.3.1, measured November 2026. It is a synthetic default-entry bundle, so an app’s real output will differ, and it is not the size of the useState demo on the left. That demo is smaller and still has to be a Client Component. 0 KB is the open and close behavior only: Modal ships no client JavaScript, and the modal stylesheet still downloads. INP was not lab-measured on this page. The invoker click never enters React. The useState click runs only after hydration.',
      }}
      browserSupport={{
        chrome: '135+',
        firefox: '144+',
        safari: '26.2+',
        note: 'These versions are command and commandfor. The feature has been Baseline Newly Available since 12 December 2025, about 87% of global users on Can I use. Edge 135 matches Chrome. closedby is a separate feature: Chrome 134 and Firefox 141 honor closedby="any" and dismiss on a backdrop click. Stable Safari does not ship closedby (Can I use, through the Safari 27 releases). WebKit merged it in July 2026, so a later Safari may pick it up. In Safari 26.2 the close button and Escape still work, because a modal dialog already treats Escape as a close request. This kit does not load a polyfill. A polyfill would put the JavaScript back.',
      }}
      verdict={
        <>
          <p>
            Ship it for a confirm dialog or any modal whose job is open, close, focus, and Escape,
            when the audience is on current Chrome, Edge, Firefox, and Safari. The page that renders
            Modal stays a Server Component. The button works from the first HTML, including before
            the client bundle arrives.
          </p>
          <p>
            Keep Radix, or a client component like the one on the left, when you still support
            Safari before 26.2, or when the dialog has to animate, take over scroll locking itself,
            or promise that a backdrop click closes it on every phone. Backdrop dismiss is closedby,
            and stable Safari does not implement it as of November 2026. The close button is the
            path that works in every browser with invoker commands.
          </p>
          <p>
            Radix buys the missing pieces with a client bundle that is idle until hydration. The
            HTML version buys the platform dialog and leaves backdrop dismiss as progressive
            enhancement. Pick the one whose gap you can live with.
          </p>
        </>
      }
    />
  )
}

export const metadata: Metadata = {
  title: 'Modal & Dialog | CSS-Only Showcase',
  description:
    'Replace a useState modal or Radix Dialog with commandfor, command, and dialog closedby. Browser support and the trade-offs, without a softened verdict.',
}

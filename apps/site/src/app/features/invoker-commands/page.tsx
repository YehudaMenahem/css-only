import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Modal } from 'css-only-kit'
import 'css-only-kit/Modal.css'
import { FeatureTemplate } from '@/components/FeatureTemplate'
import { StatefulDialog } from './StatefulDialog'
import './page.css'

const invokerSupport = 'https://caniuse.com/wf-invoker-commands'
const invokerDocs = 'https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API'
const invokerBaseline =
  'https://web-platform-dx.github.io/web-features-explorer/features/invoker-commands/'
const closedBySupport = 'https://caniuse.com/mdn-html_elements_dialog_closedby'
const closedByDocs =
  'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog#closedby'

function Source({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener">
      {children}
    </a>
  )
}

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
      <dialog ref={dialogRef} id={id} className="state-dialog" onClose={() => setOpen(false)}>
        {children}
        <button type="button" aria-label="Close" onClick={() => setOpen(false)}>
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
              handle the click. Close with the button, <Source href={closedByDocs}>Escape</Source>,
              or a backdrop click where <Source href={closedBySupport}>closedby</Source> is
              supported.
            </p>
          </Modal>
          <p className="dialog-demo-note">
            Server Component. This button is ordinary HTML, so it works before any JavaScript loads.
            Backdrop dismiss is closedby=&quot;any&quot;, which{' '}
            <Source href={closedBySupport}>Safari does not support through 27.3</Source>.
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
        note: (
          <>
            These versions are <Source href={invokerSupport}>command and commandfor</Source> (
            <Source href={invokerDocs}>MDN</Source>). The feature has been{' '}
            <Source href={invokerBaseline}>Baseline Newly Available since 12 December 2025</Source>{' '}
            (<Source href={invokerDocs}>MDN: since December 2025</Source>).{' '}
            <Source href={invokerSupport}>Can I use</Source> puts global usage at 86.98%, and{' '}
            <Source href={invokerSupport}>Edge 135</Source> matches Chrome. closedby is a separate
            feature: <Source href={closedBySupport}>Chrome 134, Edge 134, and Firefox 141</Source>{' '}
            honor closedby=&quot;any&quot; and dismiss on a backdrop click (
            <Source href={closedByDocs}>MDN</Source>).{' '}
            <Source href={closedBySupport}>
              Safari does not support closedby through 27.3. Safari Technology Preview does.
            </Source>{' '}
            In Safari 26.2 the close button and Escape still work, because a modal dialog opened
            with showModal() already treats Escape as a close request (
            <Source href={closedByDocs}>MDN</Source>). This kit does not load a polyfill. A polyfill
            would put the JavaScript back.
          </>
        ),
      }}
      verdict={
        <>
          <p>
            Ship it for a confirm dialog or any modal whose job is open, close, focus, and Escape,
            when the audience is on{' '}
            <Source href={invokerSupport}>current Chrome, Edge, Firefox, and Safari</Source>. The
            page that renders Modal stays a Server Component. The button works from the first HTML,
            including before the client bundle arrives.
          </p>
          <p>
            Keep Radix, or a client component like the one on the left, when you still support{' '}
            <Source href={invokerSupport}>Safari before 26.2</Source>, or when the dialog has to
            animate, take over scroll locking itself, or promise that a backdrop click closes it on
            every phone. Backdrop dismiss is closedby, and{' '}
            <Source href={closedBySupport}>Safari does not support it through 27.3</Source>. The
            close button is the path that works in every browser with invoker commands.
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

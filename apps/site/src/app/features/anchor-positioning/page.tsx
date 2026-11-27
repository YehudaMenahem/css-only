import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { FeatureTemplate } from '@/components/FeatureTemplate'
import { MeasuredPopover } from './MeasuredPopover'
import './page.css'

const anchorSupport = 'https://caniuse.com/css-anchor-positioning'
const anchorBaseline =
  'https://web-platform-dx.github.io/web-features-explorer/features/anchor-positioning/'
const anchorNameDocs =
  'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/anchor-name'
const positionAnchorDocs =
  'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position-anchor'
const positionAreaDocs =
  'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position-area'
const positionTryDocs =
  'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position-try-fallbacks'
const anchorGuide =
  'https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Anchor_positioning/Using'
const firefox147 = 'https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/147'
const firefoxTracking = 'https://bugzilla.mozilla.org/show_bug.cgi?id=1838746'
const firefoxTransforms = 'https://bugzilla.mozilla.org/show_bug.cgi?id=1993692'
const popoverBaseline = 'https://web-platform-dx.github.io/web-features-explorer/features/popover/'
const popoverDocs = 'https://developer.mozilla.org/en-US/docs/Web/API/Popover_API'
const radixBundle = 'https://bundlephobia.com/package/@radix-ui/react-tooltip@1.4.1'
const floatingBundle = 'https://bundlephobia.com/package/@floating-ui/react@0.27.20'

function Source({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener">
      {children}
    </a>
  )
}

const beforeCode = `'use client'

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'

type MeasuredPopoverProps = {
  id: string
  trigger: string
  children: ReactNode
}

type Point = {
  top: number
  left: number
}

const GAP = 8

export function MeasuredPopover({ id, trigger, children }: MeasuredPopoverProps) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [point, setPoint] = useState<Point | null>(null)

  useLayoutEffect(() => {
    if (!open) return

    const anchor = triggerRef.current
    const popover = popoverRef.current
    if (!anchor || !popover) return

    const place = () => {
      const anchorRect = anchor.getBoundingClientRect()
      const popoverRect = popover.getBoundingClientRect()
      let top = anchorRect.top - popoverRect.height - GAP
      if (top < GAP) top = anchorRect.bottom + GAP
      const centered = anchorRect.left + anchorRect.width / 2 - popoverRect.width / 2
      const left = Math.min(Math.max(GAP, centered), window.innerWidth - popoverRect.width - GAP)
      setPoint({ top, left })
    }

    place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const onPointer = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (triggerRef.current?.contains(target)) return
      if (popoverRef.current?.contains(target)) return
      setOpen(false)
    }

    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="demo-trigger"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          setPoint(null)
          setOpen((value) => !value)
        }}
      >
        {trigger}
      </button>
      {open ? (
        <div
          ref={popoverRef}
          id={id}
          className="note-popover measured-popover"
          style={point ? { top: point.top, left: point.left } : undefined}
          data-placed={point ? 'true' : 'false'}
        >
          {children}
        </div>
      ) : null}
    </>
  )
}`

const afterCode = `export default function Example() {
  return (
    <>
      <button type="button" className="anchored-trigger" popoverTarget="anchor-note">
        Open with HTML
      </button>
      <div id="anchor-note" popover="auto" className="anchored-popover">
        <p>popovertarget opens this. CSS keeps it next to the button.</p>
      </div>
    </>
  )
}

/* No handlers, no "use client". The site reset sets margin: 0, so the
   fallback puts the user-agent centering back. Anchor rules stay inside
   @supports, or a browser that ignores them would lose that centering. */
.anchored-popover {
  position: fixed;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  margin: 0;
}

@supports (anchor-name: --anchor-note) and (position-anchor: --anchor-note) and
  (position-area: block-start) and (position-try-fallbacks: flip-block) {
  .anchored-trigger {
    anchor-name: --anchor-note;
  }

  .anchored-popover {
    position-anchor: --anchor-note;
    position-area: block-start;
    position-try-fallbacks: flip-block;
    inset: auto;
    translate: none;
    margin-block: 0.5rem;
    margin-inline: 0;
  }
}`

export default function AnchorPositioningPage() {
  return (
    <FeatureTemplate
      title="Anchor Positioning"
      before="Floating UI / Radix Tooltip"
      after="anchor-name + popover"
      description="Open a popover on its trigger without measuring either box in JavaScript. The same job as Floating UI or a Radix tooltip, without a client component."
      beforeDemo={
        <div className="anchor-demo">
          <MeasuredPopover id="measured-note" trigger="Open with JavaScript">
            <p className="note-copy">
              A click stored open in state. A layout effect read both rectangles and wrote top and
              left. Scroll and resize run that again. Escape and a click outside are two more
              listeners.
            </p>
          </MeasuredPopover>
          <p className="anchor-demo-note">
            Client Component. This button works after the file hydrates. It is the small version of
            the pattern: one flip, no arrow, no focus move. The bundle figure below is Radix
            Tooltip, which is what teams usually ship. Floating UI is the positioning engine inside
            it.
          </p>
        </div>
      }
      afterDemo={
        <div className="anchor-demo">
          <button
            type="button"
            className="demo-trigger demo-trigger-accent anchored-trigger"
            popoverTarget="anchor-note"
          >
            Open with HTML
          </button>
          <div id="anchor-note" popover="auto" className="note-popover anchored-popover">
            <p className="note-copy">
              The button carries popovertarget. React does not handle the click.{' '}
              <Source href={anchorGuide}>anchor-name</Source> on the button and position-anchor on
              this popover keep it next to the trigger. flip-block moves it below the button when
              the top of the screen is in the way.
            </p>
          </div>
          <p className="anchor-demo-note">
            Server Component. This button is ordinary HTML, so it works before any JavaScript loads.
            Where anchor positioning is missing, the popover still opens, centered in the viewport.
          </p>
        </div>
      }
      beforeCode={beforeCode}
      afterCode={afterCode}
      costs={{
        beforeSize: 'Radix 18.8 KB',
        afterSize: '0 KB added',
        beforeINP: 'after hydration',
        afterINP: 'no React work',
        note: '18.8 KB is Bundlephobia’s minified-and-gzipped size for @radix-ui/react-tooltip 1.4.1, measured November 2026. It is a synthetic default-entry bundle, so an app’s real output will differ, and it is not the size of the measuring demo on the left. That demo is smaller and still has to be a Client Component. Radix Tooltip sits on Floating UI. @floating-ui/react 0.27.20 is 30.1 KB minified and gzipped on the same basis, for teams that call the positioning library themselves. 0 KB is the open, close, and placement behavior only: the popover is HTML and the coordinates are CSS, and the page stylesheet still downloads. INP was not lab-measured on this page. The popovertarget click never enters React. The measuring click runs only after hydration, and every scroll while the note is open writes a new position.',
      }}
      browserSupport={{
        chrome: '125+',
        firefox: '147+',
        safari: '26+',
        note: (
          <>
            These versions are <Source href={anchorNameDocs}>anchor-name</Source>.{' '}
            <Source href={anchorSupport}>Can I use</Source> marks the same releases as the start of
            partial support, and <Source href={anchorSupport}>Edge</Source> matches Chrome. The demo
            also needs <Source href={positionAnchorDocs}>position-anchor</Source>,{' '}
            <Source href={positionAreaDocs}>position-area</Source>, and{' '}
            <Source href={positionTryDocs}>position-try-fallbacks: flip-block</Source>. The current
            name of position-area starts in Chrome 129. Chrome 125 through 130 shipped it as
            inset-area. flip-block starts in Chrome 128, Firefox 147, and Safari 26. An explicit
            position-anchor name does not depend on the property&apos;s initial value. The spec
            initial value normal arrived later: Chrome 151, Firefox 151, and Safari 27.{' '}
            <Source href={anchorSupport}>Can I use</Source> puts global usage at 87.95%, split as
            2.75% full support and 85.2% partial. Safari 27 is the first version it marks as full
            support. Chrome, Edge, and Firefox are still partial.{' '}
            <Source href={anchorBaseline}>The anchor-positioning group</Source> is Limited
            availability, not Baseline. The explorer counts Chrome 157, Edge 157, and Safari 27, and
            it lists Firefox as not supported because{' '}
            <Source href={firefoxTracking}>the tracking bug is still open</Source>.{' '}
            <Source href={anchorNameDocs}>MDN</Source> marks the anchor-name property itself
            Baseline Newly Available since January 2026, when{' '}
            <Source href={firefox147}>Firefox 147 enabled anchor positioning by default</Source>.
            The group is larger than this demo. It includes anchor-size(), a transform on the
            anchor, and the @position-try descriptors.{' '}
            <Source href={firefoxTransforms}>
              Firefox is still tracking transforms on the anchor
            </Source>
            . This demo does not transform the button. Popover open and close is a separate feature,{' '}
            <Source href={popoverBaseline}>Baseline Newly Available since 27 January 2025</Source>:
            Chrome 116, Edge 116, Firefox 125, Safari 17, and Safari on iOS 18.3 (
            <Source href={popoverDocs}>MDN</Source>). Without anchor positioning the popover still
            opens, in the center. The site reset removes the user-agent margin: auto, so the
            fallback centers it with top, left, and translate. A polyfill would put the JavaScript
            back. position-area: block-start could overflow the viewport in Chrome 129 through 143
            and in Firefox 147. That bug is fixed in Chrome 144 and Firefox 148.
          </>
        ),
      }}
      verdict={
        <>
          <p>
            Ship the click popover for any current browser. The button is HTML, so it works before
            the client bundle arrives, and <Source href={popoverDocs}>popover</Source> is{' '}
            <Source href={popoverBaseline}>Baseline Newly Available</Source>. Ship the tether, the
            part that replaces Floating UI, when the audience is on Chrome 144+, Edge 144+, Firefox
            148+, and Safari 26+. Those are the versions where this page&apos;s position-area:
            block-start is past the overflow bug. The page that renders the button stays a Server
            Component.
          </p>
          <p>
            Keep <Source href={floatingBundle}>Floating UI</Source> or{' '}
            <Source href={radixBundle}>Radix Tooltip</Source> when you still support Safari before
            26, Firefox before 147, or the Chrome 129 through 143 window where block-start could
            overflow the viewport. Also keep them when the note has to open on hover, or when it
            needs an arrow, a focus move, or collision handling against a clipping ancestor.
            flip-block only moves the popover off the viewport edge. It does not walk a stack of
            overflow: hidden parents. A transform on the anchor is a further gap, and the
            web-features group is still <Source href={anchorBaseline}>not Baseline</Source> because
            of gaps like that.
          </p>
          <p>
            Radix buys the missing machinery with a client bundle that is idle until hydration. The
            HTML version buys the platform popover and leaves placement as progressive enhancement.
            In a browser without anchor positioning the note still opens. It opens in the center.
            Pick the one whose gap you can live with.
          </p>
        </>
      }
    />
  )
}

export const metadata: Metadata = {
  title: 'Anchor Positioning | CSS-Only Showcase',
  description:
    'Replace a Floating UI or Radix tooltip with anchor-name, position-area, and the popover attribute. Browser support and the trade-offs, without a softened verdict.',
}

import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { FeatureTemplate } from '@/components/FeatureTemplate'
import { scrollDemoCards } from './cards'
import { ScrollLinkedDemo } from './ScrollLinkedDemo'
import './page.css'

const scrollSupport = 'https://caniuse.com/wf-scroll-driven-animations'
const scrollDocs =
  'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline'
const scrollGuide =
  'https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations/Timelines'
const scrollBaseline =
  'https://web-platform-dx.github.io/web-features-explorer/features/scroll-driven-animations/'
const durationDocs =
  'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-duration'
const reducedMotionDocs =
  'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion'
const scrollTriggered =
  'https://web-platform-dx.github.io/web-features-explorer/features/scroll-triggered-animations/'

function Source({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener">
      {children}
    </a>
  )
}

const beforeCode = `'use client'

import { useEffect, useRef } from 'react'
import { scrollDemoCards } from './cards'

export function ScrollLinkedDemo() {
  const rootRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const scroller = scrollerRef.current
    const bar = barRef.current
    const list = listRef.current
    if (!root || !scroller || !bar || !list) return

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const write = () => {
      frame = 0
      const cards = list.querySelectorAll<HTMLElement>('.scroll-demo-card')

      if (motion.matches) {
        root.dataset.motion = 'reduce'
        bar.style.transform = ''
        cards.forEach((card) => {
          card.style.opacity = ''
          card.style.transform = ''
        })
        return
      }

      root.dataset.motion = 'allow'
      const max = scroller.scrollHeight - scroller.clientHeight
      const progress = max <= 0 ? 1 : scroller.scrollTop / max
      bar.style.transform = 'scaleX(' + progress + ')'

      const bounds = scroller.getBoundingClientRect()
      const travel = bounds.height * 0.55
      if (travel <= 0) return

      cards.forEach((card) => {
        const top = card.getBoundingClientRect().top
        const revealed = Math.min(1, Math.max(0, (bounds.bottom - top) / travel))
        card.style.opacity = revealed.toFixed(3)
        card.style.transform = 'translateY(' + ((1 - revealed) * 1.25).toFixed(3) + 'rem)'
      })
    }

    const onScroll = () => {
      if (frame !== 0) return
      frame = window.requestAnimationFrame(write)
    }

    write()
    scroller.addEventListener('scroll', onScroll, { passive: true })
    motion.addEventListener('change', write)

    return () => {
      scroller.removeEventListener('scroll', onScroll)
      motion.removeEventListener('change', write)
      if (frame !== 0) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="scroll-demo scroll-demo-js" ref={rootRef}>
      <div
        ref={scrollerRef}
        className="scroll-demo-scroller"
        tabIndex={0}
        role="region"
        aria-label="JavaScript scroll listener"
      >
        <div className="scroll-demo-progress" aria-hidden="true">
          <span className="scroll-demo-bar" ref={barRef} />
        </div>
        <div className="scroll-demo-list" ref={listRef}>
          {scrollDemoCards.map((card) => (
            <article key={card.kicker} className="scroll-demo-card">
              <span className="scroll-demo-kicker">{card.kicker}</span>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}`

const afterCode = `<div className="scroll-demo-scroller" tabIndex={0}>
  <div className="scroll-demo-progress" aria-hidden="true">
    <span className="scroll-demo-bar" />
  </div>
  <article className="scroll-demo-card">
    <span className="scroll-demo-kicker">Enter the view</span>
    <p>Each card fades and rises as it comes into view.</p>
  </article>
</div>

/* Server Component. No handlers, no "use client".
   Longhands, because the animation shorthand resets animation-timeline.
   auto fills the scroll range. A time duration can shift view().
   https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-duration */
@supports (animation-timeline: scroll()) and (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .scroll-demo-css .scroll-demo-progress {
      display: block;
    }

    .scroll-demo-css .scroll-demo-bar {
      animation-name: scroll-demo-grow;
      animation-duration: auto;
      animation-timing-function: linear;
      animation-fill-mode: both;
      animation-timeline: scroll(nearest block);
    }

    .scroll-demo-css .scroll-demo-card {
      animation-name: scroll-demo-rise;
      animation-duration: auto;
      animation-timing-function: linear;
      animation-fill-mode: both;
      animation-timeline: view();
      animation-range: entry 0% cover 40%;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .scroll-demo-css .scroll-demo-bar,
  .scroll-demo-css .scroll-demo-card {
    animation: none;
    animation-timeline: none;
  }
}`

export default function ScrollAnimationsPage() {
  return (
    <FeatureTemplate
      title="Scroll Animations"
      before="GSAP ScrollTrigger / Motion useScroll"
      after="scroll() + view()"
      description="A progress bar and a reveal tied to a scroller, with the timeline in CSS. The same motion as a scroll listener, GSAP ScrollTrigger, or Motion useScroll, without a client component."
      beforeDemo={
        <div className="scroll-demo-block">
          <ScrollLinkedDemo />
          <p className="scroll-demo-note">
            Client Component. A scroll listener reads this box and writes opacity and transform on
            the main thread. It does nothing until the file hydrates. When prefers-reduced-motion is
            reduce, it clears those writes and does not read scroll position. This is the small
            version of the pattern. The bundle figure below is the GSAP core, which teams install
            before they add ScrollTrigger.
          </p>
        </div>
      }
      afterDemo={
        <div className="scroll-demo-block">
          <div className="scroll-demo scroll-demo-css">
            <div
              className="scroll-demo-scroller"
              tabIndex={0}
              role="region"
              aria-label="CSS scroll timeline"
            >
              <div className="scroll-demo-progress" aria-hidden="true">
                <span className="scroll-demo-bar" />
              </div>
              <div className="scroll-demo-list">
                {scrollDemoCards.map((card) => (
                  <article key={card.kicker} className="scroll-demo-card">
                    <span className="scroll-demo-kicker">{card.kicker}</span>
                    <p>{card.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
          <p className="scroll-demo-note">
            Server Component. scroll() drives the bar and view() drives each card. React never sees
            the scroll. The timelines are attached only when animation-timeline is supported and
            prefers-reduced-motion is no-preference. Otherwise the cards stay in their finished
            state and the bar stays hidden. Browsers do not drop a scroll timeline on their own for
            reduced motion.
          </p>
        </div>
      }
      beforeCode={beforeCode}
      afterCode={afterCode}
      costs={{
        beforeSize: 'GSAP 26.8 KB',
        afterSize: '0 KB JS',
        beforeINP: 'scroll listener',
        afterINP: 'no scroll JS',
        note: '26.8 KB is Bundlephobia’s minified-and-gzipped size for gsap 3.15.1, measured November 2026. The gzipped byte count is 27,434. It is a synthetic default-entry bundle of the GSAP core. ScrollTrigger is a separate import on top of that core, so a page that calls ScrollTrigger is larger, and an app’s real output will differ. It is not the size of the listener on the left. That demo is smaller and still has to be a Client Component. Motion’s default entry, motion 14.14.0, is 62.8 KB on the same basis, 64,323 gzipped bytes. Importing only useScroll tree-shakes below that default, and this page does not claim that smaller number. 0 KB is the scroll() and view() behavior only: the page ships no client JavaScript for the effect, and the stylesheet still downloads. INP was not lab-measured. The labels describe the scroll path. The listener reads layout and writes style on the main thread. The CSS timelines are not a JavaScript task.',
      }}
      browserSupport={{
        chrome: '115+',
        firefox: '159+',
        safari: '26+',
        note: (
          <>
            These versions are <Source href={scrollSupport}>scroll-driven animations</Source> (
            <Source href={scrollDocs}>MDN</Source>):{' '}
            <Source href={scrollSupport}>Chrome 115, Edge 115, Firefox 159, and Safari 26</Source>.
            The feature has been{' '}
            <Source href={scrollBaseline}>Baseline Newly Available since 27 October 2026</Source>,
            the day Firefox 159 shipped it (
            <Source href={scrollDocs}>MDN: since October 2026</Source>).{' '}
            <Source href={scrollSupport}>Can I use</Source> puts global usage at 89.12%. Safari 18.7
            and earlier do not support it, and neither does Firefox before 159.{' '}
            <Source href={reducedMotionDocs}>prefers-reduced-motion</Source> does not detach a
            scroll timeline by itself. <Source href={scrollGuide}>MDN’s timeline guide</Source> says
            to set animation-timeline to none inside the reduced-motion query. This page does that,
            and it also refuses to attach scroll() or view() when the preference is reduce. There is
            no polyfill. A polyfill would put the JavaScript back.{' '}
            <Source href={durationDocs}>animation-duration is auto</Source>, which fills the scroll
            range. A time duration can shift a view() timeline. Scroll-triggered animations, the
            play-once cousin, are a separate feature and remain{' '}
            <Source href={scrollTriggered}>limited to Chrome and Edge 146</Source>.
          </>
        ),
      }}
      verdict={
        <>
          <p>
            Ship it for a progress bar or a reveal that is allowed to run backward when the reader
            scrolls back, when the audience is on{' '}
            <Source href={scrollSupport}>
              Chrome 115, Edge 115, Firefox 159, and Safari 26, or later.
            </Source>{' '}
            The page that renders the effect stays a Server Component. The timelines run from the
            first HTML, including before any client bundle arrives, and they stay off when the
            reader has asked for reduced motion.
          </p>
          <p>
            Keep GSAP ScrollTrigger, or Motion’s useScroll, when you still support{' '}
            <Source href={scrollSupport}>Firefox before 159 or Safari 18</Source>, or when the
            effect has to pin an element, fire a callback, or play once and stay finished. view()
            scrubs both directions. Play-once is{' '}
            <Source href={scrollTriggered}>scroll-triggered animations</Source>, which Firefox and
            Safari do not ship. Pinning and onEnter are still library behavior.
          </p>
          <p>
            The library buys those controls with a client bundle that reads scroll position after
            hydration. CSS buys scroll() and view() and leaves older browsers on a static, readable
            layout. Pick the gap you can live with.
          </p>
        </>
      }
    />
  )
}

export const metadata: Metadata = {
  title: 'Scroll Animations | CSS-Only Showcase',
  description:
    'Replace a scroll listener, GSAP ScrollTrigger, or Motion useScroll with animation-timeline, scroll(), and view(). Browser support, reduced motion, and the trade-offs.',
}

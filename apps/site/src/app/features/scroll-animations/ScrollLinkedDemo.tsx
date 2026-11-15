'use client'

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
}

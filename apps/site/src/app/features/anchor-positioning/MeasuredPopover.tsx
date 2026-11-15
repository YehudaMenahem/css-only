'use client'

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
}

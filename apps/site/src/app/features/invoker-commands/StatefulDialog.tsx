'use client'

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
}

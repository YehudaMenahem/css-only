import { type ComponentPropsWithoutRef, type ReactNode } from 'react'

type ModalProps = {
  id: string
  trigger: ReactNode
  children: ReactNode
  className?: string
  triggerClassName?: string
  triggerProps?: ComponentPropsWithoutRef<'button'>
}

export function Modal({
  id,
  trigger,
  children,
  className = '',
  triggerClassName = '',
  triggerProps = {},
}: ModalProps) {
  if (!id) {
    throw new Error('Modal requires an id prop')
  }

  return (
    <>
      <button
        type="button"
        // React 18.3+ passes commandfor through. Older versions may need suppressHydrationWarning.
        commandfor={id}
        command="show-modal"
        className={triggerClassName}
        {...triggerProps}
      >
        {trigger}
      </button>

      <dialog id={id} className={className} closedby="any">
        <div className="modal-content">{children}</div>
        <button
          type="button"
          commandfor={id}
          command="close"
          className="modal-close"
          aria-label="Close"
        >
          ×
        </button>
      </dialog>
    </>
  )
}

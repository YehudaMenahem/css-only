/**
 * Modal component using CSS-only behavior via invoker commands and dialog.
 *
 * @param {Object} props - Component props
 * @param {string} props.id - Required unique ID for the dialog element
 * @param {React.ReactNode} props.trigger - Button content for opening the modal
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} [props.className] - Additional CSS class for the dialog
 * @param {string} [props.triggerClassName] - Additional CSS class for the trigger button
 * @param {Object} [props.triggerProps] - Additional props for the trigger button
 * @returns {JSX.Element}
 *
 * @example
 * <Modal id="example-modal" trigger="Open Modal">
 *   <h2>Modal Title</h2>
 *   <p>Modal content goes here</p>
 * </Modal>
 */
export function Modal({
  id,
  trigger,
  children,
  className = '',
  triggerClassName = '',
  triggerProps = {},
}) {
  if (!id) {
    throw new Error('Modal requires an id prop')
  }

  return (
    <>
      <button
        type="button"
        // Note: React 18.3+ passes commandfor through, but older versions may need suppressHydrationWarning
        // @ts-ignore - commandfor is a newer HTML attribute not yet in React types
        commandfor={id}
        command="show-modal"
        className={triggerClassName}
        {...triggerProps}
      >
        {trigger}
      </button>

      <dialog
        id={id}
        className={className}
        // @ts-ignore - closedby is a newer HTML attribute not yet in React types
        closedby="any"
      >
        <div className="modal-content">{children}</div>
        <button
          type="button"
          // @ts-ignore
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

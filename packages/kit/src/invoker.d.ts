// HTML invoker attributes. command and commandfor are missing from @types/react.
// closedby is already on dialog there; this repeats the same union next to the other two.
declare namespace React {
  // T is required so this merges with React's ButtonHTMLAttributes<T>.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ButtonHTMLAttributes<T> {
    /** id of the element this button invokes. */
    commandfor?: string
    /**
     * Invoker command. Built-in keywords, or a custom command starting with `--`.
     * @see https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-command
     */
    command?:
      | 'toggle-popover'
      | 'show-popover'
      | 'hide-popover'
      | 'close'
      | 'request-close'
      | 'show-modal'
      | `--${string}`
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface DialogHTMLAttributes<T> {
    /** How the dialog can be dismissed. */
    closedby?: 'any' | 'closerequest' | 'none'
  }
}

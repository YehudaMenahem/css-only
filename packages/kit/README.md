# CSS-Only Kit

React components with CSS-only behavior—no JavaScript state, effects, or event handlers required.

## Overview

A component library for React applications where components achieve interactivity through modern CSS and HTML features alone. All components are compatible with React Server Components (no "use client" directive needed).

### Key Features

- **Zero client-side JavaScript** — no useState, useEffect, or event handlers
- **React Server Component compatible** — works in Next.js App Router without "use client"
- **Cascade layers** — all styles shipped in @layer for easy theming
- **Per-component CSS imports** — import only what you use
- **Theming via CSS custom properties** — override tokens without fighting specificity
- **JSDoc annotations** — ready for TypeScript migration

## Installation

```bash
npm install css-only-kit
# or
pnpm add css-only-kit
# or
yarn add css-only-kit
```

**Note:** This package is not yet published to npm. Currently used as a workspace dependency in the showcase site.

## Components

### Modal

A modal dialog using HTML's `commandfor`/`command` attributes and `<dialog closedby>` for CSS-only open/close behavior.

#### Usage

```jsx
import { Modal } from 'css-only-kit'
import 'css-only-kit/Modal.css'

export default function MyPage() {
  return (
    <Modal
      id="example-modal"
      trigger="Open Modal"
      triggerClassName="my-button"
    >
      <h2>Modal Title</h2>
      <p>Modal content goes here.</p>
    </Modal>
  )
}
```

#### Props

- `id` (required): Unique ID for the dialog element
- `trigger` (required): Button content for opening the modal
- `children` (required): Modal content
- `className`: Additional CSS class for the dialog element
- `triggerClassName`: Additional CSS class for the trigger button
- `triggerProps`: Additional props spread onto the trigger button

#### Browser Support

- **commandfor/command**: Chrome 126+, Edge 126+ (limited support)
- **dialog closedby**: Chrome 126+, Edge 126+ (not yet in Firefox/Safari)

**Fallback:** The close button (×) remains visible and interactive for browsers without `closedby` support.

#### React Compatibility

React 18.3+ passes `commandfor` and `command` attributes through correctly. For older React versions, you may need `suppressHydrationWarning` on the button elements.

#### Customization

The Modal ships with styles in cascade layers:

- `kit.tokens` — CSS custom properties for colors, spacing, etc.
- `kit.base` — Base dialog and backdrop styles
- `kit.components` — Modal-specific component styles

Override tokens in your own CSS:

```css
@layer my-theme {
  :root {
    --modal-bg: #ffffff;
    --modal-text: #000000;
    --modal-accent: #0066ff;
  }
}
```

Layers allow your theme to override kit tokens without specificity wars.

## Architecture

### CSS Cascade Layers

All kit styles are organized into cascade layers:

1. **kit.tokens** — CSS custom properties (colors, spacing, typography)
2. **kit.base** — Base element styles (dialog, button, etc.)
3. **kit.components** — Component-specific styles (modal-content, modal-close)

This structure lets you override tokens or inject your own layer between kit layers for full control.

### File Structure

```
packages/kit/
├── src/
│   ├── Modal/
│   │   ├── Modal.jsx    # Component
│   │   └── Modal.css    # Component styles
│   └── index.js         # Main export
├── dist/                # Built output
│   ├── index.js
│   ├── Modal.js
│   └── Modal.css
└── package.json
```

### Build Process

- **tsup** builds ES modules from `src/**/*.jsx`
- **CSS files** are copied to `dist/` alongside their components
- **package.json exports** provide subpath imports for per-component CSS

### Exports

```json
{
  ".": "./dist/index.js",
  "./Modal": "./dist/Modal.js",
  "./Modal.css": "./dist/Modal.css"
}
```

Import the component and its styles separately:

```js
import { Modal } from 'css-only-kit'      // Component
import 'css-only-kit/Modal.css'            // Styles
```

## Theming

All kit components use CSS custom properties for theming. Override them in your own CSS:

```css
@layer app-theme {
  :root {
    /* Modal tokens */
    --modal-backdrop: rgba(0, 0, 0, 0.9);
    --modal-bg: #1a1a1a;
    --modal-text: #ffffff;
    --modal-accent: #ff3366;
    --modal-padding: 2rem;
    --modal-radius: 0.5rem;
  }
}
```

Place your theme in a layer (e.g., `app-theme`) to control cascade order relative to `kit.tokens`.

## Browser Support

Targets modern browsers with CSS features like:

- Cascade layers (`@layer`)
- CSS nesting
- CSS custom properties
- Container queries
- `:has()` selector

### Component-Specific Support

- **Modal (commandfor/closedby)**: Chrome 126+, Edge 126+ (limited)
  - Fallback: Visible close button for older browsers

## Contributing

This kit is part of the [CSS-Only Showcase](https://github.com) project. Contributions are welcome!

## License

MIT

---

**Part of the CSS-Only Showcase by [Yehuda Menahem](https://github.com)**

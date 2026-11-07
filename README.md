# CSS-Only Showcase

Modern CSS replacing JavaScript in React components: a showcase of measured trade-offs and a CSS-only React component kit.

## About

A showcase site aimed at senior frontend developers and technical decision-makers at React-first companies. The premise: you don't need to rewrite your entire application to reduce JavaScript—just swap individual components where the performance trade-off makes sense.

Each feature demonstrates a common React pattern that relies on JavaScript libraries and shows how modern CSS can achieve the same behavior with zero client-side JS. Every comparison includes measured costs (bundle size, main-thread time, INP) and honest assessments of browser support and complexity.

## Tech Stack

### Architecture

- **pnpm workspace monorepo** with two packages:
  - `apps/site` — Next.js showcase site (App Router)
  - `packages/kit` — CSS-only React component library

### Site (`apps/site`)

- **Next.js 14** with App Router
- **Plain JavaScript** (.jsx/.js) with JSDoc annotations (TypeScript migration planned)
- **Vanilla CSS** with native nesting, cascade layers (@layer), and custom properties
- **next/font** for optimized font loading (variable display font)
- **No client components** in the site's own pages—everything is React Server Components
- **Playwright** for smoke tests
- **ESLint + Prettier + Stylelint** with browser-support linting

### Component Kit (`packages/kit`)

- **React components** with CSS-only behavior (no useState, useEffect, or event handlers)
- **Compatible with React Server Components** (no "use client" directive needed)
- **Per-component CSS** shipped in cascade layers (kit.tokens, kit.base, kit.components)
- **Theming via CSS custom properties**
- **Built with tsup** — outputs ES modules + separate CSS files
- **npm-ready** exports for per-component imports (e.g., `import { Modal } from 'css-only-kit'` + `import 'css-only-kit/Modal.css'`)

### Tooling

- **browserslist** configuration targeting modern browsers (last 2 versions)
- **Stylelint** with `stylelint-no-unsupported-browser-features` plugin
- **GitHub Actions** CI workflow (lint, build, test)
- **Vercel** deployment-ready (no extra config needed)

## Repository Structure

```
.
├── apps/
│   └── site/                 # Next.js showcase site
│       ├── src/
│       │   ├── app/          # App Router pages
│       │   │   ├── features/ # Feature comparison pages
│       │   │   ├── layout.jsx
│       │   │   └── page.jsx
│       │   ├── components/   # Shared site components
│       │   └── styles/       # Global styles
│       ├── tests/            # Playwright tests
│       └── package.json
│
├── packages/
│   └── kit/                  # CSS-only component library
│       ├── src/
│       │   ├── Modal/        # Modal component + CSS
│       │   └── index.ts      # Main export
│       ├── dist/             # Built output (gitignored)
│       └── package.json
│
├── .github/
│   └── workflows/
│       └── ci.yml            # GitHub Actions CI
│
├── pnpm-workspace.yaml       # pnpm workspace config
├── .browserslistrc           # Browser support targets
├── .prettierrc               # Prettier config
└── package.json              # Root scripts
```

## Features

The site showcases seven CSS-only replacements for common JavaScript libraries:

1. **View Transitions** — `@view-transition` vs. Framer Motion page transitions
2. **Scroll Animations** — `animation-timeline` vs. GSAP ScrollTrigger / Motion useScroll
3. **Anchor Positioning** — `anchor-name` + `popover` vs. Floating UI / Radix Tooltip
4. **Modal & Dialog** — `commandfor` + `command` + `closedby` vs. useState / Radix Dialog
5. **Custom Select** — `appearance: base-select` vs. react-select
6. **CSS Carousel** — `::scroll-button` + `::scroll-marker` vs. Embla / Swiper
7. **Sibling Functions** — `sibling-index()` / `sibling-count()` vs. inline `style={{'--i': index}}`

Each feature page includes:

- Live before/after demos
- Code comparisons
- Measured costs (bundle size, INP)
- Browser support matrix
- Honest verdict on trade-offs

## Getting Started

### Prerequisites

- Node.js 18 or later
- pnpm 8 or later

### Installation

```bash
pnpm install
```

### Development

Start the Next.js dev server:

```bash
pnpm dev
```

The site will be available at `http://localhost:3000`.

### Building

Build all packages:

```bash
pnpm build
```

This builds both the component kit (`packages/kit`) and the site (`apps/site`).

### Linting & Formatting

```bash
# Run ESLint and Stylelint
pnpm lint

# Check Prettier formatting
pnpm format:check

# Auto-fix formatting
pnpm format
```

### Testing

Run Playwright tests:

```bash
pnpm test
```

For CI environments:

```bash
pnpm test:ci
```

## Component Kit Usage

The kit is consumed by the site as a workspace dependency (`css-only-kit: workspace:*`). External projects would install it from npm (when published).

### Example: Modal Component

```jsx
import { Modal } from 'css-only-kit'
import 'css-only-kit/Modal.css'

export default function MyPage() {
  return (
    <Modal id="example" trigger="Open Modal">
      <h2>Modal Title</h2>
      <p>This modal uses zero JavaScript.</p>
    </Modal>
  )
}
```

The Modal component uses HTML's `commandfor`/`command` attributes and `<dialog closedby>` for CSS-only open/close behavior. No state, no effects, no event handlers—it's a React Server Component.

## Design Philosophy

### Visual Direction

- **Dark, editorial, and edgy** — big variable display type, one bold accent color (#ff3366)
- **Generous negative space** with subtle grain texture
- **Minimal and tasteful** — understated branding (small "0 KB JS" badge, footer credit line)

### Technical Principles

- **CSS-only behavior** — components have no JavaScript state, effects, or event handlers
- **React Server Component compatible** — no "use client" directive needed
- **Cascade layers** — all kit styles shipped in @layer for easy theming and overrides
- **Graceful degradation** — @supports-based fallbacks documented where needed
- **Measured honesty** — every feature page includes real performance data and trade-off assessments

## Browser Support

Targets modern browsers with native CSS features like container queries, `:has()`, nesting, and cascade layers:

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)

Some CSS-only features (e.g., `commandfor`, `closedby`, `appearance: base-select`) have limited support and require fallback strategies documented in the component kit.

## Contributing

This is a personal showcase project by Yehuda Menahem. Contributions, issues, and feature requests are welcome.

## License

MIT

---

**Built by [Yehuda Menahem](https://github.com)**

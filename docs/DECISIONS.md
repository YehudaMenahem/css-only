# Decisions

Every technical choice in this project, and why it was made.
Each entry is a short answer (2-3 sentences) that I can explain in an interview.

- **Core** — interview depth: be ready for follow-up questions.
- **Tool** — 30-second level: what it is and why it's here.

---

## TypeScript vs JSDoc · Core ✅

JSDoc is just a comment. Nothing enforces it, so over time it goes stale and stops reflecting the code.
With TypeScript, types are checked in the editor and at build time, so they always stay in sync with the code, and mistakes are caught before they reach the user.

**How:** The kit uses `strict` mode, so nothing is silently `any` and possibly-undefined values must be handled. New HTML attributes that React's types don't know yet (`commandfor`, `closedby`) are added through declaration merging in `invoker.d.ts`, instead of hiding errors with `@ts-ignore`. The migration is gradual: the kit first, the site later.

---

## pnpm + monorepo · Tool ✅

The site and the kit live in one repo because they evolve together: the site is the kit's live demo, so a new component and the page that shows it ship in one PR, with no need to publish a new version to npm.

pnpm workspaces connect the two: `"css-only-kit": "workspace:*"` means "use the local package from this repo". It does not build anything; `pnpm build` at the root builds the kit before the site.

Separation is kept at the package level (each has its own `package.json`, and the site only uses what the kit exports). If the kit had its own team or many external users, separate repos would be worth considering.

---

## Modal performance: single backdrop blur · Core ✅

Issue #14. The Modal felt slow. Measurements showed no long tasks (no JS cost); the cost was CSS rendering: a double blur (panel + ::backdrop) and a 200ms close.

Measured the same way as the issue: Playwright Chromium, CDP Paint and Raster totals over the open/close trace, 5 runs reported as median (p90). Desktop is 1280×800. Throttled mobile is a Pixel 7 viewport, 4× CPU, and a fast-4G-ish network (70ms RTT, 1.6Mbps down / 0.75Mbps up). Open is the first frame at opacity ≥ 0.98. Close is when the panel is visually gone.

Desktop, before → after: open 172.7 (173.1) → 97.8 (98.1) ms; close 171.6 (171.9) → 0.4 (0.5) ms; Paint 7.3 (7.6) → 1 (1.2) ms; Raster 0.8 (2.1) → 0.2 (0.3) ms. Throttled mobile: open 170.2 (174.4) → 94.4 (98.7) ms; close 165.1 (170.6) → 1.4 (2.6) ms; Paint 21 (23.9) → 4.9 (5.4) ms; Raster 0.7 (0.9) → 0.4 (1.1) ms. No long tasks, and no frames longer than 16.7ms during open or close.

**How:** Removed the panel's own backdrop-filter, since blurring an already-blurred backdrop is nearly invisible but costs full Paint. Kept one 8px blur on ::backdrop, opening at 100ms ease-out with an instant close. `prefers-reduced-motion: reduce` turns that fade off.

---

## Open

### Sessions 1–2 · kit to TypeScript

- [ ] tsup (building the kit as a library) · Tool
- [ ] ES modules · Tool

### Sessions 3–4 · site to TypeScript + deploy

- [ ] Next.js App Router · Core
- [ ] Vercel · Tool

### Sessions 5–6 · Modal page

- [ ] React Server Components (why no "use client") · Core
- [ ] `<dialog>` + invoker commands (`commandfor` / `command` / `closedby`) · Core

### Sessions 7–8 · Anchor Positioning page

- [ ] Cascade layers (`@layer`) · Core
- [ ] Custom properties + theming · Core

### Sessions 9–10 · Scroll Animations page

- [ ] browserslist + `@supports` fallbacks · Tool
- [ ] Stylelint + browser-support linting · Tool

### Sessions 11–12 · polish

- [ ] Playwright · Tool
- [ ] GitHub Actions CI · Tool
- [ ] ESLint vs Prettier · Tool
- [ ] next/font · Tool
- [ ] Native CSS nesting · Tool
- [ ] INP + bundle size (how features are measured) · Core

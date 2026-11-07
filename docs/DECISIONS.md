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

## Open

### Sessions 1–2 · kit to TypeScript

- [ ] tsup (building the kit as a library) · Tool
- [ ] ES modules · Tool

### Sessions 3–4 · site to TypeScript + deploy

- [ ] pnpm + monorepo (workspaces) · Tool
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

## Working rules for agents

- Several agents may work on this repo at the same time. Always work in your own git worktree, on a new branch from up-to-date main. Never switch branches, stash, or commit in the main folder.
- Only touch files the task needs. If you need to change a shared file outside the task's scope (packages/kit, FeatureTemplate, globals.css, layout, package.json, pnpm-lock.yaml), stop and ask first.
- Don't add dependencies without asking.
- One logical change per PR, one self-contained commit per step. Conventional Commits.
- Before opening a PR: lint, typecheck and build must pass.
- Everything in the repo is in English.

## CSS principles

Showcasing modern CSS is the point of this project.

- Prefer the newest native CSS/HTML that fits the job over JavaScript or older techniques.
- Progressive enhancement: the page must stay usable in all current major browsers. Use Baseline features for core layout; put newer features behind @supports with a fallback.
- Check support (MDN / Can I Use) before using a feature, and mention the fallback in the PR description.

## CSS-only rule

- Kit components and the "after" demos must be CSS/HTML-only: no useState, useEffect, event handlers or "use client". They must work as React Server Components.
- Exceptions: the "before" demos (JavaScript on purpose, for comparison) and any polyfill I approve.
- If a feature can't be done CSS-only, stop and ask — don't fall back to JavaScript on your own.

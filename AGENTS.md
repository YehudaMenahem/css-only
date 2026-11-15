## Working rules for agents

- Several agents may work on this repo at the same time. Always work in your own git worktree, on a new branch from up-to-date main. Never switch branches, stash, or commit in the main folder.
- Only touch files the task needs. If you need to change a shared file outside the task's scope (packages/kit, FeatureTemplate, globals.css, layout, package.json, pnpm-lock.yaml), stop and ask first.
- Don't add dependencies without asking.
- One logical change per PR, one self-contained commit per step. Conventional Commits.
- Before opening a PR: lint, typecheck and build must pass.
- Everything in the repo is in English.

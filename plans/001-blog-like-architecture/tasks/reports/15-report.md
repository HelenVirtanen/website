# 15 agent-docs — report
Status: DONE_WITH_CONCERNS. contract: 621371f0

Changed: CLAUDE.md, AGENTS.md (pointer), apps/website/{CLAUDE,AGENTS}.md, packages/{ui,content,design-system,fonts}/{CLAUDE,AGENTS}.md, packages/fonts/README.md.
Root CLAUDE.md: §1 tree + packages, §2.8 (+pnpm test), §4 scripts (new:event|talk|speaker|partner|faq, test, check:seo, no-cache, BUILD_NOW), §5 (scale.ts tables, constant padding/spacing, layout.inset/gap, root max(100%, 100vw / 120), rem, @media structure-only), §6, §8 (TTF), §9 rewritten (i18n, content, markdown-safety, SEO/OG, search, tests, CI, tools/visual), §10 stories path, §12, §13.
Rules not touched: §2.9 commits, dependencies, comments.

Done when:
- cmp pairs: no DIFF; content and og pairs exist: OK
- grep packages/content|packages/og|i18n in CLAUDE.md: OK
- grep "bumps|new:report|new:speaker": "bumps" and "new:report" gone; "new:speaker" remains on purpose (the command exists, package.json) -> literal check cannot be empty
- grep pnpm test|check:seo|100vw / 120: all present
- pnpm lint: exit 0

Concerns:
- packages/content/{CLAUDE,AGENTS}.md and packages/og/{CLAUDE,AGENTS}.md are NOT tracked: ~/.gitignore_global:669 ignores CLAUDE.md (AGENTS.md of content is tracked, og untracked too). Conductor must `git add -f` CLAUDE.md of content and og (and og/AGENTS.md if untracked) or AC-2 fails in the repo.
- packages/og/CLAUDE.md and apps/storybook, eslint-config, icons, typescript-config checked: still accurate, unchanged.

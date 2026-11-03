# Report 03 — scale tables
Status: DONE. contract: 621371f0
- scale.ts (resolver + typeScale/space/layoutSpace), scale.test.ts (12 tests), vitest 5.0.5 via pnpm add -D, turbo test task, root test script.
- spacing/border/radius in rem; themes/spacing.css.ts without @media; typography/layout generated from tables; root.css.ts html font-size max(100%, 100vw / 120); theme-colors.ts; exports ./scale, ./theme-colors.
- vars.layout.inset|gap.{m,l,xxl} added to layout contract (CSS names --layout-inset-*, --layout-gap-*).
- Docs: packages/design-system AGENTS.md/CLAUDE.md updated in sync.
- Done when: test pass, grep 100vw/120 ok, no px' literals outside comments, no @media in spacing.css.ts, lint/build/test exit 0.
- Note: components still use padding.m/l/xxl and spacing.*; desktop visual shift expected until task 04.

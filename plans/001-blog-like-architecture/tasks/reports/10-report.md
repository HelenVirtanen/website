# Task 10 report
Status: DONE_WITH_CONCERNS. contract: 621371f0
Done-when: og tests pass; build ok; dist/og/events/31.png 1200x630, en/events/31.twitter.png 1200x600; 16 og/twitter tags on events/31; twitter:card=summary_large_image; cmp CLAUDE/AGENTS silent; lint, test, build exit 0.
Cards: apps/website/dist/og/events/31.png, apps/website/dist/og/en/talks/anchor-and-popover.twitter.png
Concerns: (1) astro 7.0.6 fails on `[...path].png.ts` with trailingSlash 'always' (pattern has no slash, build asks with slash); route is `pages/og/[...path].ts` with `.png` inside the param. Fixed upstream probably (blog on 7.4.2). (2) `sharp` added as a direct dep of website (bundled prerender chunk cannot resolve it otherwise). (3) event og:type = website, talk = article, speaker = profile. (4) BaseLayout drops the `card` prop and finds the page by pathname via publicPagesOf; telegram link from pages/<lang>/index.md.

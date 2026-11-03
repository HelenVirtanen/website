# Task 11 pagefind-search: DONE
- pnpm lint/test/build/build:storybook: exit 0; pagefind languages en, ru; 14 pages indexed.
- dist/search/index.html: noindex=1, data-pagefind-body=0.
- Browser (playwright-core, preview): /search/?q=Макушин -> /speakers/denis-makushin/ (+event, talk); /en/search/?q=Makushin -> only /en/ links; /en/search/?q=Макушин -> nothing.
- Gotcha: bundled dynamic import leaves __VITE_PRELOAD__ in the inlined script; import lives in an is:inline script, search.ts calls window.loadPagefind.

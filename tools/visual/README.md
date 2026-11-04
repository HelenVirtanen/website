# Visual regression tooling

Screenshot tooling that guards the look of the site and of the UI components while the
architecture changes underneath. It captures the homepage sections and every Storybook story
at five widths, then compares two capture sets pixel by pixel.

- `capture.mjs <out-dir>` writes PNGs:
  - `<out-dir>/site/<name>@<width>.png` for every `[data-visual]` element on the homepage
    (`navbar`, `hero`, `program`, `partner`, `faq`);
  - `<out-dir>/stories/<story-id>@<width>.png` for the `#storybook-root` of every story listed in
    Storybook's `index.json`.
- `compare.mjs <base-dir> <next-dir>` compares every PNG of `base-dir` with the same-named PNG in
  `next-dir` using `pixelmatch` (threshold 0.1). A missing file, a size mismatch or more than
  0.1% differing pixels is an error. The exit code is 1 on any error. Diff images of changed files
  are written to `<next-dir>/diff/`.

Widths: 375, 768, 1024, 1280, 1440, 1920. Viewport height 900, `deviceScaleFactor: 1`,
`reducedMotion: 'reduce'`.

## Prerequisites

The scripts do **not** start any server. Start both before capturing:

```bash
pnpm build                                  # builds apps/website/dist
pnpm --filter website preview               # http://localhost:4321/
pnpm storybook                              # http://localhost:6006/ (dev server)
```

Run the servers in separate terminals (or in the background) and stop them when done.

The browser is the one installed in the system, on Windows, macOS or Linux; none is downloaded
(`playwright-core` only).

## Usage

```bash
# 1. baseline from the unchanged code
node tools/visual/capture.mjs .visual/baseline

# 2. after the changes: capture again and compare
node tools/visual/capture.mjs .visual/check
node tools/visual/compare.mjs .visual/baseline .visual/check
```

`.visual/` is git-ignored. `capture.mjs` removes `<out-dir>` before writing, so it only accepts a
directory inside `.visual/`. Every capture writes `manifest.json` (commit, dirty flag, time, Chromium
version); `compare.mjs` prints both manifests, so a baseline taken from the wrong code is visible.

`compare.mjs` fails on a missing file, a size change, a PNG present only in `<next-dir>` (the baseline
is incomplete) and a diff above 0.1% per image. Pass `--exact` for refactors that must not move a
single pixel: 0.1% of a 1920×2800 capture is ~5,000 pixels, enough to hide a full-width divider shift.

## Environment variables

| Variable        | Default                  | Meaning                                  |
| --------------- | ------------------------ | ---------------------------------------- |
| `SITE_URL`      | `http://localhost:4321/` | Homepage served by `astro preview`.      |
| `STORYBOOK_URL` | `http://localhost:6006`  | Storybook dev server (`/index.json`).    |
| `VISUAL_SOURCE_DIR` | repo root | Checkout the servers run from; its commit goes into `manifest.json`. |
| `CHROMIUM_PATH` | found automatically      | Browser executable. Without it the scripts take the installed Chrome, then Edge, then `/usr/bin/chromium`. |

## Determinism notes

- `window.ResizeObserver` is replaced with a no-op in the capture browser. Captures before
  2026-11-03 needed it: the card slider equalised slide heights from a resize handler, which woke
  Swiper's ResizeObserver again and moved everything below the FAQ by a fraction of a pixel on every
  frame. The slider now leaves heights to CSS, but the no-op stays so new captures remain comparable
  with the old baselines. Captures of FAQ taken with old code at 1440px and wider are 19px shorter
  than the real page: with the observer off, the old code measured the slides too early.
- Fonts (`document.fonts.ready`), lazy images and async server-rendered stories are awaited
  before every screenshot.
- A full run takes several minutes (stories x widths). Failures do not stop the run: all of them
  are listed at the end and the exit code is 1.
- Requests to origins other than `SITE_URL` and `STORYBOOK_URL` are blocked (documents come back
  empty). The Yandex map iframe otherwise renders differently on every run and would break
  determinism; it is captured as an empty frame.
- The sticky navbar can overlap a section in an element screenshot taken at a scroll offset; it is
  the same in every run, so it does not affect comparisons.

Section shots hide every other `[data-visual]` element (visibility only, layout unchanged), so the sticky
NavBar does not bleed into the sections under it.

To rebuild a baseline from an older commit, serve it from a separate worktree and point
`VISUAL_SOURCE_DIR` at it; run `capture.mjs` from the current tree.

## Hit targets

`check-targets.mjs [url]` opens the built site at 375 and 1440, opens the menu on the narrow width
and checks every link and button of the header, menu and slider, plus the language switcher: the box
is at least 42×42 and keyboard focus draws an outline of `rgb(56, 69, 207)`, at least 1px thick. It
prints each violation and exits with 1.

## Accessibility gate

`pnpm check:a11y` (`check-a11y.mjs`) serves the built `apps/website/dist` itself, so it needs no running
server, and exits 1 on any violation. It covers every page type in the light and dark theme at 375 and 1440:

- axe with the WCAG 2.0, 2.1 and 2.2 A and AA rules;
- structure: language, title, one `h1`, heading order, one `main`;
- keyboard: skip link first, a visible ring on every stop, nothing off screen or under the sticky header;
- the phone menu: opens by keyboard, keeps Tab inside, Esc closes and returns focus;
- reflow at 320, text at 200% and the WCAG 1.4.12 text spacing;
- a pause control for moving content, and sliders with live animation.

Automation finds only part of the problems. A screen reader run and the keyboard inside the third-party map
frame stay manual. Build with `BUILD_NOW` set before a meetup to also check the floating button.

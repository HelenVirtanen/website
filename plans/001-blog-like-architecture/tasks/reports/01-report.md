# Report 01 (contract: 621371f0)
Baseline .visual/baseline: 30 site PNG (6 x 5 widths), 130 story PNG (26 stories x 5). Repeat capture + compare: exit 0, 160 files, all 0.0000%. pnpm lint/build pass; .visual ignored.
Deps: playwright-core 1.64.1, pixelmatch 8.0.0, pngjs 7.0.0.
Run: pnpm build; pnpm --filter website preview (:4321); pnpm storybook (:6006); node tools/visual/capture.mjs <dir>; node tools/visual/compare.mjs <base> <next>. ~50 s per capture. Servers stopped.
Determinism workarounds in capture.mjs: (1) ResizeObserver no-op (Swiper in CardSlider re-measures every frame, sub-pixel height jitter: real layout shift on the live site, not fixed); (2) zero-height story components-mediatile--image-placeholder captured as 1px strip; (3) non-local origins blocked (Yandex map iframe differs per run); (4) sticky navbar overlaps sections in element shots, constant across runs.
Caveat: baseline does not guard ResizeObserver-driven layout or map contents.

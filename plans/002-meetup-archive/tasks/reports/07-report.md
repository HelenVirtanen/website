# Task 07 — meetups 28–30 (2025–2026)

Status: DONE. contract: 8e4298e3

## Files
events/{ru,en}/{28,29,30}.md (6), talks/{ru,en}/*.md (20, 10 slugs), plans/002-meetup-archive/videos.csv (+2 rows).
Done-when: check-batch rc 0; build + check:seo + test rc 0; dist/events/{28,29,30} and dist/en/events/{28,29,30} exist.

## Per meetup
- 28 (2025-06-26 18:00, MTS Fintech): sources old-site/28.html, sheet. Registration Timepad 3422244, map yandex CHWsQL5R. Talks: animations-without-js, design-system-as-time-generator, mentors-dementors.
- 29 (2025-11-06 18:00, School 21): old-site/29.html, Telegram 345/348. Registration 3639677, recording VK 456239487, photos disk.360.yandex.ru. Talks: css-without-breakpoints, power-of-pseudo-selectors, data-by-link-and-4-nuances, copyright-for-developers. Shek talk not included (cancelled).
- 30 (2026-05-28 18:00, School 21): old-site/30.html, Telegram 359-375. Registration 3975211, recording VK 456239521, photos disk.yandex.ru album (link from 30.html). Talks: design-without-designer, css-as-api-design-tokens, you-dont-know-bem.

## Not found / not filled
- Talk times (none in sources); schedule blocks (breaks; 30's "BEM vs Tailwind" secret activity from Telegram 364/369 has no stated time); coordinates; partners (out of scope).
- 28: no recording and no photo album in sources (Telegram 325 promises both, no link ever posted); no YouTube/VK video found. Stream link (mts-link, Telegram 323) not stored: past, not a recording.
- youtube.json has no videos for these meetups.

## Discrepancies
- 29 address: old site "ул. Вятская, д. 21, стр. 42" (used, per task); Telegram 343 says "Вятская ул., 27, стр. 42". Needs editor check.
- Old 30.html first `<time datetime>` says 2025-11-06 (copy-paste bug); text and second time say 28 May 2026 — used 2026-05-28.
- Title typos fixed: bullets of Volkov talk ("правилно", "менорскую"). Left as in source: "о внешнюю экспертизу", "одно и тоже", "масштабируемость" (ambiguous, not obvious typos). Non-breaking hyphens normalized to plain.
- 30 body: dropped the "Вот и прошел наш юбилейный митап" status line.

## Videos
| url | kind | target |
|---|---|---|
| https://vkvideo.ru/video-167479002_456239487 | event | 29 |
| https://vkvideo.ru/video-167479002_456239521 | event | 30 |

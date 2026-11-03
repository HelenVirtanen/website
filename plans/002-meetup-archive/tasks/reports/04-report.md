# Task 04 (meetups 7-16, 2018-2019): DONE_WITH_CONCERNS

contract: 8e4298e3

## Result
20 event files (7..16 x ru/en), 70 talk files (35 talks x ru/en), 30 rows appended to `plans/002-meetup-archive/videos.csv` (kinds: 24 talk, 6 event).
Done-when: check-batch rc 0; `build`, `check:seo`, `test` rc 0; all 20 event pages exist in dist. (First build attempts failed with a missing-file error from the parallel build; re-run was green.)

## Sources per meetup
Date, program, descriptions: `sheet.csv` (date from the sheet is the same as in Telegram). Venue, registration (Timepad), full-stream links, photo albums: Telegram. The old site covers only 28-30. Telegram posters are images with only the number, date and venue; no time or address.

| # | Date | Venue | registrationUrl | recordingUrl | photosUrl |
|---|------|-------|-----------------|--------------|-----------|
| 7 | 2018-03-06 | Rambler&Co | 663280 | none (only a Facebook live link) | Facebook album 1692374884139635 |
| 8 | 2018-05-15 | Tinkoff | 699186 | none | Facebook album 1761497030560753 |
| 9 | 2018-10-02 | DomClick | 814801 | YouTube rYK74pJp_10 | none |
| 10 | 2018-12-04 | Tinkoff | 856816 | none | none |
| 11 | 2019-03-25 | Raiffeisenbank | 922360 | YouTube ijZTu7aVJtg | Facebook album 2212829628760822 |
| 12 | 2019-05-14 | tceh | 966798 | YouTube LHOJybXuMdc | none |
| 13 | 2019-06-18 | Rambler&Co | 993875 | none (only a Facebook live link) | none |
| 14 | 2019-07-25 | Ozon | 1013335 | YouTube F2orkQYKOI8 | Facebook album 2425774597466323 |
| 15 | 2019-10-29 | Cian | 1081950 | YouTube 0QaeK_E8Ptc | Facebook album 2631016146942166 |
| 16 | 2019-12-03 | Kaspersky | 1105058 | YouTube TGbNBoFJ66s | `https://is.gd/6FHdNp` (short link, "photos from moscowcss_16") |

## Omitted facts (no source)
- `time` (start) and `venue.address` for all ten meetups: neither Telegram text, posters nor the sheet has them (they were only on Timepad pages, not in the sources). Telegram mentions only "7th floor" for 8 and 10: not an address, not used. No coordinates/mapUrl, no talk `time`, no speaker roles added.
- Event bodies are empty (as for 1-6).
- No photo albums found for 9, 10, 12, 13 (AC-5). Photo albums are Facebook (the sources have no VK / Yandex Disk albums for these meetups); I used them as albums, change if only VK/Yandex are acceptable.

## Judgment calls (assumptions)
- `recordingUrl` = the YouTube link of the live broadcast posted in Telegram on the day of the meetup (9, 11, 12, 14, 15, 16). For 9 the link (msg 39, 02.10.2018, bare YouTube link without text) is assumed to be the stream.
- Facebook live links for 7 (afishamansarda/videos/1901332616557448) and 13 (.../2200175693432491) not used (not YouTube/VK).
- `modes`: offline everywhere; "online" added where a broadcast existed (7, 9, 11-16); 8 and 10 offline only. `passportRequired: true` only where Telegram says "паспорт" (7, 8, 10, 11, 12, 15); false for 9, 13, 14, 16 (13/14 say only "вход строго по спискам").
- Venue spellings: Telegram over the sheet ("Rambler&Co", "Райффайзенбанк", "tceh", "Тинькофф" for the sheet typo "Тинькоф"; "Озон" and "Циан" and "Касперский" as in the sheet).
- Taglines follow the pattern of 31/1-6.

## Discrepancies
- Meetup 12: Telegram announces a third talk by Arslan Mamedov (3D interfaces, msg 69); the sheet has 3 talks without him (Okhrimenko, Lesnevsky, Borisov). Sheet kept, Mamedov not in the registry, no file. Worth checking with the organisers.
- Meetup 8: sheet speaker "Дима Короле" is the typo for Dima Korolev (registry variant); Telegram writes "Королёв".
- Meetup 16 BRAND x UI: sheet text kept; Telegram has a different blurb ("Расскажем о чем наш новый бренд...").
- Meetup 14 Telegram msg 95 links the three talk videos via bit.ly; used the YouTube ids from `youtube.json` instead.

## Ru text fixes (explicit typos only)
Прокажу->Покажу, результа->результата, соответсвовать->соответствовать, расскрою->раскрою, Cssnexnt->Cssnext, преймущество->преимущество, рассажут->расскажут, сделанно->сделано. Zero-width characters stripped. Left as is: "перфомансом", "СSSinJS" (Cyrillic/Latin mix), "верстка -это".

## Videos
Talks (24): 10: qGNwQULq9co tinkoff-design-system; PVWQHZOuAnw animation-performance; zyITxD-z7qQ styling-reusable-ui-components. 11: dNie86pSw24 taming-design-tokens; h3Do8UZAAWU lets-not-wait; mSWMSmaGrEo frontend-testing-for-developers; w39AWcIMbZ4 macos-driven-development. 12: yyUpfhR5ScE great-artists-steal; 0RykI_wj4mU work-efficiency-taming-my-day; Bf8bTOS0sNI svg-in-plain-language. 13: lrv_skRkmts why-me-junior-frontend; G6oPs4Fn3L4 design-system-for-a-startup; O4B5N92hQSg hiding-focus-properly; _e5Rbl1i_js when-to-quit. 14: _XczxtpLxQ0 why-teach-to-learn; meEUD3v4Hq8 presentation-life-cycle; CeDdgCDq86s css-time-to-say-goodbye. 15: x0nD8VUScmc extending-css-with-houdini; o5nOs4n18xY spa-in-pure-css; 5QVnY8lJ6d8 css-variable-naming. 16: 0T9NIqp4W9o designer-plus-code-recipe; 5gfcWaKJEUY universal-component-libraries; wbTEDA8A4xY chasing-performance; nXMAMXzNb2c brand-x-ui.
Events (6): 9, 11, 12, 14, 15, 16 (see table).
No video in `youtube.json` for talks of meetups 7, 8, 9 and for 10/Mzhachikh "hunting-visual-regressions" (all 11 talks without video). All `youtube.json` videos for these meetups are used; the 15-16 playlist links (is.gd) and the 14 bit.ly link were not added.

# Task 03 (meetups 1-6, 2017): DONE

contract: 8e4298e3

## Result
12 event files (1..6 x ru/en), 36 talk files (18 talks x ru/en), 15 rows in `plans/002-meetup-archive/videos.csv`.
Done-when: check-batch rc 0; `build`, `check:seo`, `test` rc 0; all 12 event pages exist in dist.

## Sources per meetup
Date, venue, talks, descriptions: `sheet.csv` only (Telegram starts 05.02.2018; the old site covers only 28-30). Videos: `youtube.json`, matched by speaker and topic.

| # | Date | Venue |
|---|------|-------|
| 1 | 2017-03-02 | Yandex |
| 2 | 2017-04-06 | Rambler |
| 3 | 2017-05-18 | Tinkoff ("Тинькоф" typo fixed to "Тинькофф" in ru) |
| 4 | 2017-09-07 | Odin |
| 5 | 2017-10-31 | Tutu |
| 6 | 2017-12-07 | Yandex |

## Omitted facts (no source)
`time`, `venue.address`, `venue.mapUrl`, coordinates, `registrationUrl`, `recordingUrl`, `photosUrl` for all six meetups; talk `time`; speaker roles. No full-meetup recording and no photo album exist in any source (AC-5: none found). `modes` = offline, `passportRequired: false`, per the owner's decision. Event bodies are empty.

## Discrepancies / notes
- Talk 6/Vinogradov: the sheet description is "-"; the body is "—" in both languages (body must be non-empty).
- Sheet text kept verbatim (including "Сanvas" with a Latin/Cyrillic mix in talk 1/Popov Arseniy).
- Meetup 6 talks (Ermolenko, Rozov, Vinogradov): no video in `youtube.json`.
- Taglines are written in the pattern of event 31 ("N митап сообщества фронтендеров, площадка — X").

## Videos (all 15 in videos.csv, kind talk)
1: 1BS4V5r_HQQ css-features-you-might-not-know; 1VM-vEItVeA css-methodologies-a-to-b; RdwdaHiBxxY vector-graphics-on-the-web
2: fIAokeTWgGU undocumented-css-tricks; GdG6Mv-HDLs time-to-snort-grid-layout; 67ZnhTpsH-Y watching-over-css
3: Y63XbOM6Kzw top-15-css-mistakes; MyPU8bqvDzY atomic-css-in-the-wild; o39tg3BgABw fontend-optimization
4: Z1v9IWKh7aU ui-kit-downside; KmMWxnqVYYM css-and-html-are-a-programming-language; Lj68Ite2DOc games-without-javascript
5: R3FbcemvoEo webp-what-it-is-and-how-to-use-it; M3BKdrBgmYU responsive-svg; y7Aba5Nppio markup-developer-legacy
6: none

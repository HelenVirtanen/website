# Task 06 (meetups 24-27, 2024): DONE_WITH_CONCERNS

contract: 8e4298e3

## Result
8 event files (4 x ru/en), 30 talk files (15 talks x ru/en), 4 rows appended to `videos.csv` (all `event`).
`build`, `check:seo`, `pnpm test` rc 0; all 8 event pages exist in dist. No speakers created (all in registry).

## Concern: check-batch fails for 27 (needs a fix outside my ownership)
`check-batch.py` counts only sheet rows whose `Митап` cell is `27`, i.e. 1. The sheet has 3 talks for 27: two continuation rows with an empty number follow it (Константинов, Ярош; the Telegram posts 299/300 confirm both). I wrote 3 talks. The command gives rc 1 (`27/ru: докладов 3, ожидалось 1`). With `'27': 3` added to `COUNT_OVERRIDE` (tested on a temp copy), rc is 0 for 24 25 26 27. Please add that override.

## Sources per meetup
| Slug | Date / time | Venue, address | registration | recording | photos |
|---|---|---|---|---|---|
| 24 | 2024-02-15, 19:00 (reg 18:30; TG 270) | MTS AI, Подсосенский пер. 23 стр. 2, 4 этаж (TG 269); map yandex CCUV6JqGGA (TG 269) | timepad 2754739 | YT jrcQ5puY8ew (youtube.json) | none |
| 25 | 2024-04-22, 19:00 (reg 18:30; TG 279) | Sber Agile Home, Кутузовский пр. 32 (TG 273, 278); map CDV67Byw | timepad 2802905 | VK video-225485687_456239017 (stream, TG 279) | none |
| 26 | 2024-06-19, 19:00 (TG 286) | Яндекс Экстрополис (sheet), ул. Льва Толстого 16 (TG 287); map org/yandeks/1124715036 | events.yandex.ru/events/moscow-css-yandex-2024-06-19 | YT bPgiOkMyxJQ (stream, TG 287) | disk.yandex.ru/d/57HNxYrbaoc-Yw (TG 288) |
| 27 | 2024-08-22, 19:00 (TG 298) | red_mad_robot (sheet, TG 298) | timepad 2989392 | VK video-13392530_456239339 (stream, TG 302) | none |

Titles and descriptions are from the sheet. Talk times are from the day-of Telegram programmes (24: 19:05/19:30/20:10/20:35/21:00; 25: 19:05/19:30/20:15/20:45; 26: 19:05/19:30/20:15). `schedule` carries the break: 24 19:55-20:10, 25 and 26 19:55-20:15.

## Facts not found
- 27: no address, no map link, no programme with times (so no talk times). No photo album.
- 24, 25, 27: no photo album in Telegram (AC-5); only 26 has one.
- Coordinates: none for any meetup.
- 24: the sheet title "Как настроить код, который правит сам себя?" is kept; Telegram 270 names it "Хочу писать, чтобы само всё правилось! Как это настроить". Sheet wins by the priority rule.
- 25: Telegram 275 appends Shalygin's sentence ("Рассмотрим создание кастомных стилей...") to Levchenko's description; the sheet text is used.
- Galkovskaya (25) has no company in Telegram; role empty in the registry.
- 27 talk titles for Константинов/Ярош come only from the sheet (Telegram gives no titles).

## Judgment calls
- `time` = the opening word (19:00) as in tasks 05; 24 reg from 18:30 is not used.
- `passportRequired`: 25 true ("ОБЯЗАТЕЛЬНО ПОДГОТОВЬТЕ ПАСПОРТ"), 27 true ("строго по паспорту"); 24 false (TG 269: not passports but email confirmation); 26 false (nothing stated).
- `modes` offline + online for all (streams existed for all four).
- `recordingUrl` for 25, 26, 27 are live-stream links from Telegram (no full record in youtube.json); for 24 the youtube.json recording is used, not the stream uR08k0zMoHU from TG 270.
- Venue 26 name "Яндекс Экстрополис" (sheet) / "Yandex Extropolis".
- EN title of 27's Ярош talk: "Shadcn: the Alien in the matryoshka" (translation of "Чужой в матроске").
- Yandex map links are the Telegram short links, https as given.

## Videos (youtube.json relevant to 24-27)
| Video | Used | Target |
|---|---|---|
| YT jrcQ5puY8ew "Moscowcss_24 MTS AI" | yes | event 24 |
| VK video-225485687_456239017 (TG 279) | yes | event 25 |
| YT bPgiOkMyxJQ (TG 287) | yes | event 26 |
| VK video-13392530_456239339 (TG 302) | yes | event 27 |
| YT uR08k0zMoHU (TG 270 stream of 24) | no | duplicate of the full record |
No per-talk videos exist for these meetups.

Files: packages/content/src/events/{ru,en}/{24,25,26,27}.md; packages/content/src/talks/{ru,en}/*.md (15 new slugs); plans/002-meetup-archive/videos.csv.

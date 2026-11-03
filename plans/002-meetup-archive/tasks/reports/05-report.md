# Task 05 (meetups 17, online-2021, 18, 19, 19-plus, 20-23; 2020-2023): DONE_WITH_CONCERNS

contract: 8e4298e3

## Result
18 event files (9 x ru/en), 50 talk files (25 talks x ru/en), 16 rows appended to `plans/002-meetup-archive/videos.csv` (8 talk, 8 event).
Done-when: check-batch rc 0; `build`, `check:seo`, `test` green; all 18 event pages exist in dist; speakers all in registry (none created).

## Sources per meetup
Date/program/descriptions: sheet.csv. Venue, address, time, registration, stream/photos: Telegram (day-of and announcement posts). Old site has only 28-30. Speakers: all found in speakers.csv.

| Slug | Date | Time | Venue / address | registrationUrl | recordingUrl | photosUrl |
|---|---|---|---|---|---|---|
| 17 | 2020-02-06 | 19:00 (reg 18:30) | Align Technology, Varshavskoe sh. 9 bldg 1B | timepad 1228234 | none (only per-talk videos) | `https://bit.do/fsEtM` (see concerns) |
| online-2021 | 2021-12-21 | 19:00 | Online / YouTube stream | none ("no registration") | YT NTFZtJXIVIQ | none |
| 18 | 2022-09-22 | 19:00 | MTS AI, Podsosensky per. 23 bldg 2 | timepad 2162009 | YT VKzK1VkD-LU | VK album-139668978_288264827 |
| 19 | 2022-12-20 | 19:00 | Lektoriy Skillbox, Leninsky pr. 6 bldg 20 | timepad 2257291 | YT joo2SXJXW6Q | VK album-139668978_290248151 |
| 19-plus | 2023-01-26 | 19:00 | Online / YouTube stream | timepad 2274133 | YT Ptlv_HZ8UFc | none |
| 20 | 2023-03-22 | 19:00 | SberMarket Tech, Sadovnicheskaya 9A (Space1, 6th floor) | timepad 2352508 | `youtube.com/live/dhjDOhQHnuA` (Telegram only) | VK album-139668978_292064943 |
| 22 | 2023-07-06 | 19:00 | Lektoriy Skillbox | timepad 2465968 | YT KCDraR68_bA | none found |
| 21 | 2023-09-28 | 19:00 | MTS AI | timepad 2589151 | YT cVDcrZHdbKo | none found |
| 23 | 2023-12-14 | 18:30 | Avito, Lesnaya 7, 15th floor | timepad 2691210 | YT cYgw9LGvb7k | VK album-139668978_301240682 |

mapUrl (Yandex short links from Telegram) set for 18, 19, 20, 21, 22.

## Not found
- No photo album: online-2021, 19-plus, 21, 22 (AC-5). Telegram never posted one.
- 17: no full recording (Telegram links a playlist `clc.to/moscowcss17_videos`, not used; per-talk videos from youtube.json used).
- 23: no start time other than "waiting for you from 18:30" (used as `time`); no talk times for 17, 19, 23.
- No coordinates for any meetup (no source).

## Judgment calls (please review)
- `time` = start of the program (19:00) where Telegram names it; 17 uses "19:00 first talk"; 23 uses 18:30 (only time stated).
- Talk `time` filled for online-2021, 18, 20, 21, 22 from the day-of Telegram program (the task file says talk times are absent; for these meetups they are not). Not filled for 17, 19, 23 (no program with times). Schedule items: break for 18 and online-2021 (break + workshop) only; 21/22 breaks give only a start time, not a range, so skipped; online-2021 "round table" 20:30 has no end, skipped.
- `passportRequired: true` for 17, 19, 20, 22 ("documents for entry") and 23 ("passport"); false for 18, 21, online ones (nothing said). "Documents" read as ID.
- `modes`: 17 offline only (no stream mentioned); 18-23 offline + online; online ones online.
- Venue names: "Лекторий Skillbox" (Telegram) instead of sheet "Скиллбокс"; "СберМаркет Tech"; "Авито".
- Taglines for online ones: "Онлайн-встреча ... на YouTube", "Онлайн-выпуск 19+ ...".
- Event 20 address carries the building hint ("Space1", 6th floor) in the address line; 23 carries "15 этаж".
- `bit.do/fsEtM` was `http://` in Telegram; upgraded to `https://` (schema requires https), not verified to resolve over https.
- online-2021 body: names the invited experts from Telegram (HueTone, AccessiblePalette).
- Same YouTube video used twice (talk + event) for online-2021 and 19-plus: both rows in videos.csv.

## Discrepancies
- Meetup 22: sheet title of Ermolov's talk "Как выжить junior разработчику в 2023 году..." vs Telegram program "Как команде не убить Джуна, а джуну не умереть на первой работе"; sheet kept. Telegram program order also differs from sheet order (times follow Telegram).
- Meetup 20: Avdeev's title in Telegram "Как подружиться с дизайнером"; sheet kept.
- Meetup 23: Telegram announced Lyudmila Mzhachikh (VK) ("Здравствуй, Новый CSS"); a speaker fell ill on 12.12 and was replaced by Aleksey Ivanov; the sheet has no Mzhachikh, so no file. Worth confirming that she was the one who dropped out.
- Meetup 21: speaker replaced on 27.09 (Korchuganova); sheet is consistent.
- Meetup 18: the 2020 Wheely edition (24.03.2020, Timepad 1278244, talk by Igor Alekseev) was cancelled (Covid) and never held; no file.
- Meetup 18 Telegram also mentions a cancelled UX-research talk; ignored.

## Ru text fixes
Latin `c`/`с` fixed in "cтань" and "c фронтенд-разработчиком"; `< length />` in sheet written as `` `<length>` `` (code span, avoids raw-HTML check; Telegram dropped it); nbsp/trailing whitespace removed; Avdeev title "подружить дизайнера с..." kept from sheet. Descriptions otherwise verbatim.

## Videos (appended to videos.csv)
Talks: 17: dif07leiGI4 understanding-the-designer; XgciQKPyMqU css-in-web-components; rBrsm4_Dk0Y custom-properties-variables-or-properties. online-2021: NTFZtJXIVIQ magic-of-color. 19-plus: Ptlv_HZ8UFc unexplored-lengthland-extended. 20: WliFSy9kXr8 tailwind-css-startup-or-not; _TYXe3hVMvM experiments-simply-about-complex; PFLTSfIt_G4 befriending-designer-and-frontend-developer.
Events: online-2021 NTFZtJXIVIQ, 18 VKzK1VkD-LU, 19 joo2SXJXW6Q, 19-plus Ptlv_HZ8UFc, 20 dhjDOhQHnuA (not in youtube.json), 21 cVDcrZHdbKo, 22 KCDraR68_bA, 23 cYgw9LGvb7k.
Every youtube.json video for these meetups is used. Not used: VK Video link for 19 (Telegram 183, alongside the YouTube recording). `Moscowcss_24 MTS AI` belongs to task 06.

# Task 09 (portraits l-z): DONE

contract: 8e4298e3

31 slugs in range l-z. 21 portraits, 10 avatars. Ledger: `plans/002-meetup-archive/portraits-l-z.csv`.

## Portraits (21)
- 19 new `<slug>.jpg` (480x480), cropped with sharp from single-speaker Telegram announcement cards (photo half only, card star and text excluded; crops checked by eye, star fragments removed by re-cropping).
- 2 old-site files wired by slug: `roman-ganin.png`, `roman-troitsky.png` (names unchanged).
- `photo` + `photoAlt` added to ru and en (42 speaker files).

## Avatars (10)
- nikita-morozov, nikolay-korobov: the only photo is a group card of two people, faces cannot be matched to names.
- 8 with no Telegram/old-site photo naming them: sergey-popov, savva-mikhalevsky, maksim-panov, leonid-lebedev, sasha-ermolenko, misha-rozov, viktoriya-dubrovskaya, pavel-korshikov.

## Done-when
- `pnpm --filter website build` and `pnpm test`: exit 0.
- Every l-z slug of speakers.csv has a ledger row: yes (31).
- New files in `speakers/assets/[l-z]*`: all 480x480. Old-site files: roman-ganin.png 524x524, roman-troitsky.png 840x840 (square).
- `photo` present in ru and en for each `portrait` row: yes.

## Notes
- Tight crops: sofia-valitova and lev-solntsev cut the chin slightly (card photo is tight, star blocks a bigger square).
- Helper scripts: scratchpad `work09/`.

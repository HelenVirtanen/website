# Task 08 (portraits a-k): DONE_WITH_CONCERNS

contract: e9668572

54 slugs in range a-k. 42 portraits, 12 avatars. Ledger: `plans/002-meetup-archive/portraits-a-k.csv`.

## Portraits (42)
- 32 new `<slug>.jpg` (480x480) cropped with sharp from single-speaker Telegram announcement cards (photo half only, card star and text excluded; coordinates picked by eye and each result checked).
- 7 existing old-site files wired in (alexander-nikulin, anton-volkov, alexandra-fomakina, dmitry-borisenko, anna-lapa, anastasiya-shek, anastasiya-maltseva), 3 already wired (anna-rastorgueva, daria-egorova, denis-makushin; untouched).
- `photo` + `photoAlt` added to ru and en for the 39 newly wired speakers.

## Avatars (12)
- ivan-babkov: card photo is cropped to part of the face and the star covers the rest; a clean square would cut an eye.
- ksenia-mayorova: only photo is a small helmeted figure on a scooter, face too small.
- 10 with no Telegram/old-site photo naming them: arseniy-popov, dmitry-grigorov, darya-pushkarskaya, elena-semenova, andrey-smirnov, artem-nechunaev, anton-vinogradov, georgy-buzin, alexander-plesovchkikh, aleksey-ivanov.

## Done-when
- `pnpm --filter website build && pnpm test`: exit 0 (turbo cache hit reported for the final tasks).
- Every a-k slug of speakers.csv has a ledger row: checked.
- photo present in ru and en for every `portrait` row: checked.
- Square >= 240x240 for new files: all new files are 480x480. Pre-existing files not mine: alexandra-fomakina.jpg is 834x835 (old-site original, 1px off square), anna-rastorgueva.jpg 790x922 and denis-makushin.jpg 1024x1152 (existing, left untouched per task).

## Concerns / record
- `dima-korole`: speakers.csv/content name is "Дима Короле"; the Telegram card says "Дима Королев" (same talk "Через тернии к ATM"). Name not changed (out of scope); likely truncated surname.
- `anastasiya-maltseva`: old-site file is named `alexandra-maltseva`, Telegram says Анастасия Мальцева (Егорова); wired by the task's slug-match rule, identity not independently confirmed.
- Several tight crops (alexander-shatalov, dima-korole, andrey-yamanov) cut chin/forehead because the card photo is already tight and the star blocks a larger square.
- Helper scripts: scratchpad `work08/`.

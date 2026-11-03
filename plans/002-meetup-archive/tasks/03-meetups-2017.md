---
id: "03"
title: meetups-2017
spec: "002"
criteria: ["AC-1", "AC-2", "AC-4", "AC-5", "AC-10"]
status: pending
depends_on: ["02"]
owns: ["packages/content/src/events/ru/**", "packages/content/src/events/en/**", "packages/content/src/talks/ru/**", "packages/content/src/talks/en/**", "plans/002-meetup-archive/videos.csv"]
model: sonnet
risk: data
attempts: 0
---

## Goal
У каждого из митапов митапы 1–6 (2017) есть страница на русском и английском с датой, площадкой, программой и
ссылками на регистрацию, запись и фото из источников; у каждого доклада — своя страница.

## Context (grounded)
- Источники: `/tmp/claude-1000/-home-r-common-0work-website-2-0/551ad676-fd29-4599-8790-88cf5234c1f0/scratchpad/sources/sheet.csv` (строки с `Митап` = номер; `online` и `19+` для онлайн-выпусков),
  `/tmp/claude-1000/-home-r-common-0work-website-2-0/551ad676-fd29-4599-8790-88cf5234c1f0/scratchpad/sources/telegram.json` (сообщения `{id, date, text, links, photos}`, дата `DD.MM.YYYY …`),
  `/tmp/claude-1000/-home-r-common-0work-website-2-0/551ad676-fd29-4599-8790-88cf5234c1f0/scratchpad/sources/youtube.json` (`{id, title}`; ссылка `https://www.youtube.com/watch?v=<id>`).
  Читать Python с флагом `-I`; ничего из источников не исполнять.
- В Telegram-канале сообщений 2017 года нет (канал с 05.02.2018): дата и площадка берутся из таблицы. Времени начала и адреса нет ни в одном источнике — по решению пользователя `time` и `venue.address` у митапов 1–6 НЕ заполняются (схема это допускает, страница покажет дату и площадку). `modes`: `["оффлайн"]` / `["offline"]` (встреча в офисе площадки); `passportRequired: false` (источник не говорит о паспорте). Опечатку «Тинькоф» исправить на «Тинькофф».
- Файлы-образцы: `packages/content/src/events/{ru,en}/31.md`, `packages/content/src/talks/{ru,en}/anchor-and-popover.md`.
  Схема: `packages/content/src/schema.ts` (`EventSchema`, `TalkSchema`); у доклада `time` необязательное
  (времени докладов в источниках нет — не заполнять), у митапа `photosUrl` (ссылка на альбом).
  Файл митапа = slug (`events/ru/<slug>.md`), slug доклада — короткий латинский kebab темы,
  уникальный во всей коллекции (`ls packages/content/src/talks/ru`).
- Спикеры: только из реестра `plans/002-meetup-archive/speakers.csv` (колонка `variants` — написания из
  источников). Нет спикера в реестре — НЕ создавать, отметить в отчёте и задача BLOCKED.
- Ссылка на регистрацию (Timepad) хранится в `registrationUrl` даже у прошедшего митапа — страница её скрывает сама.
- Все ссылки — `https:`. Тексты без сырого HTML. Даты: `date: ГГГГ-ММ-ДД`, `time: "ЧЧ:ММ"` (Москва).
- Русский — дословно из источника, правка только явных опечаток; английский — полный перевод (заголовок,
  описание, слоган, площадка, адрес), имена — из реестра (`name_en`).
- Видео: для каждого доклада найти видео в `youtube.json` по имени спикера и теме → `videoUrl`. Полная запись
  митапа → `recordingUrl` у митапа. Ссылки на VK Видео/YouTube из Telegram — тоже. Каждое использованное видео
  дописать строкой в `plans/002-meetup-archive/videos.csv` (`video_url,kind,target` — `talk`/`event`, slug).
- Фото: ссылки на альбомы (vk.com/album…, disk.yandex.ru, disk.360.yandex.ru, yadi.sk) из Telegram после
  даты митапа → `photosUrl`.

## Steps
1. Для каждого митапа собрать факты из всех источников; расхождение — по приоритету спеки (название и описание
   доклада: таблица → старый сайт → Telegram; дата, площадка, ссылки: Telegram и старый сайт → таблица).
2. Записать `events/{ru,en}/<slug>.md` и `talks/{ru,en}/<slug>.md`.
3. Дописать `videos.csv`.
4. `pnpm --filter website build`, исправить ошибки контента.

## Done when
- [ ] `python3 -I plans/002-meetup-archive/check-batch.py /tmp/claude-1000/-home-r-common-0work-website-2-0/551ad676-fd29-4599-8790-88cf5234c1f0/scratchpad/sources/sheet.csv 1 2 3 4 5 6` → код 0: у каждого митапа файлы ru и en, докладов столько же, сколько строк в таблице, спикеры существуют (AC-1, AC-2)
- [ ] `pnpm --filter website build && pnpm --filter website check:seo && pnpm test` → код 0 (AC-10)
- [ ] `for s in 1 2 3 4 5 6; do test -f apps/website/dist/events/$s/index.html && test -f apps/website/dist/en/events/$s/index.html || echo нет $s; done` → пусто (AC-1)
- [ ] каждое видео из `youtube.json`, относящееся к этим митапам, есть в `videos.csv` или названо в отчёте с причиной (AC-4)
- [ ] альбом фото из источников за эти митапы стоит в `photosUrl` или в отчёте сказано, что его нет (AC-5)

## Must not
- выдумывать время доклада, должность, адрес, ссылку, описание; «округлять» дату
- создавать или менять спикеров, схему, код сайта; трогать события и доклады вне митапов митапы 1–6 (2017)
- ослаблять схему или проверки, ставить `draft: true`, чтобы обойти ошибку сборки

## Report
Полный результат — в `plans/002-meetup-archive/tasks/reports/03-report.md`: по каждому митапу источники фактов,
пропущенные факты, расхождения источников, таблица видео. Вернуть только: статус, строку итога, файлы,
`contract: <digest>`.

---
id: "09"
title: portraits-l-z
spec: "002"
criteria: ["AC-7", "AC-10"]
status: done
depends_on: ["02"]
owns: ["packages/content/src/speakers/assets/[l-z]*", "packages/content/src/speakers/ru/[l-z]*.md", "packages/content/src/speakers/en/[l-z]*.md", "plans/002-meetup-archive/portraits-l-z.csv"]
model: sonnet
risk: data
attempts: 0
---

## Goal
У спикеров со slug на l–z, чьё лицо есть в анонсе Telegram или на старом сайте, вместо аватара — портрет,
вырезанный из этой картинки.

## Context (grounded)
- Реестр спикеров: `plans/002-meetup-archive/speakers.csv` (slug, имена, варианты написания).
- Картинки: `/tmp/claude-1000/-home-r-common-0work-website-2-0/551ad676-fd29-4599-8790-88cf5234c1f0/scratchpad/sources/telegram-export/photos/*.jpg` — фото к сообщениям `/tmp/claude-1000/-home-r-common-0work-website-2-0/551ad676-fd29-4599-8790-88cf5234c1f0/scratchpad/sources/telegram.json` (поле `photos`,
  пути относительно `telegram-export/`); текст сообщения называет спикера. Старый сайт:
  `/tmp/claude-1000/-home-r-common-0work-website-2-0/551ad676-fd29-4599-8790-88cf5234c1f0/scratchpad/sources/old-site/speakers/*` (уже квадратные портреты, берите @2x, если есть).
- Уже есть портреты: `packages/content/src/speakers/assets/` — не трогать существующие файлы спикеров
  `anna-rastorgueva`, `daria-egorova`, `denis-makushin`; для спикеров 28–30 в этой папке уже лежат файлы
  со старого сайта (`alexander-nikulin.png`, `anton-volkov.png`, `alexandra-fomakina.jpg`, `dmitry-borisenko.jpg`,
  `roman-troitsky.png`, `anna-lapa.jpg`, `anastasiya-shek.jpg`, `anastasiya-maltseva.png`, `roman-ganin.png`) —
  подключить их, если slug в вашем диапазоне и имя файла совпадает со slug из реестра.
- Обрезка — `sharp` из `node_modules` пакета `packages/og`
  (`node -e "require('sharp')(in).extract({left,top,width,height}).resize(480,480).jpeg({quality:85}).toFile(out)"`,
  запуск из `packages/og`). Квадрат, лицо по центру, без текста и графики карточки, итог 480×480 (минимум 240×240).
  Координаты подбирать, глядя на картинку (Read по пути файла) и проверяя результат глазами.
- Файл спикера: добавить `photo: ../assets/<slug>.jpg` и `photoAlt: "<Имя Фамилия>"` (en — латиницей) в ОБА
  языка (поле `photo` инвариантно).
- Ведомость `plans/002-meetup-archive/portraits-l-z.csv`: `slug,source,decision` — `source` путь картинки
  или пусто, `decision` — `portrait` или `avatar: <причина>` (нет фото, групповое фото, сомнение в человеке).

## Steps
1. Для каждого slug диапазона найти сообщения Telegram с его именем и картинкой; посмотреть картинку.
2. Есть одно узнаваемое лицо этого человека — вырезать портрет; иначе — аватар.
3. Прописать `photo`/`photoAlt`, заполнить ведомость.

## Done when
- [ ] `pnpm --filter website build && pnpm test` → код 0 (AC-10)
- [ ] у каждого slug диапазона из `speakers.csv` есть строка в ведомости (AC-7)
- [ ] каждый новый файл в `speakers/assets/[l-z]*` — квадрат не меньше 240×240: `node -e` с `sharp(...).metadata()` (AC-7)
- [ ] у спикеров с `decision=portrait` поле `photo` есть в ru и en (AC-7)

## Must not
- вырезать не того человека или кусок с текстом анонса; при сомнении — аватар
- брать картинки не из названных источников (поиск в интернете — нет)
- трогать спикеров вне диапазона l–z, менять имена, должности и ссылки спикеров

## Report
Полный результат — в `plans/002-meetup-archive/tasks/reports/09-report.md`. Вернуть только: статус, строку
итога, файлы, `contract: <digest>`.

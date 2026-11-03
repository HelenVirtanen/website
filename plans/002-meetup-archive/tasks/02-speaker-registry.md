---
id: "02"
title: speaker-registry
spec: "002"
criteria: ["AC-3", "AC-10"]
status: pending
depends_on: ["01"]
owns: ["packages/content/src/speakers/ru/**", "packages/content/src/speakers/en/**", "plans/002-meetup-archive/speakers.csv"]
model: sonnet
risk: data
attempts: 0
---

## Goal
Каждый спикер митапов 1–30 заведён ровно один раз (ru и en), а реестр `plans/002-meetup-archive/speakers.csv`
сопоставляет любое написание имени в источниках с одним slug.

## Context (grounded)
- Источники: `/tmp/claude-1000/-home-r-common-0work-website-2-0/551ad676-fd29-4599-8790-88cf5234c1f0/scratchpad/sources/sheet.csv` (колонка `Докладчик(и)`, несколько имён в ячейке через перевод строки;
  встречается порядок «Фамилия Имя», уменьшительные «Серёжа», «Дима», опечатки «Дима Короле»,
  невидимые символы U+200B), `/tmp/claude-1000/-home-r-common-0work-website-2-0/551ad676-fd29-4599-8790-88cf5234c1f0/scratchpad/sources/old-site/{28,29,30}.html` (спикеры 28–30 с должностями),
  `/tmp/claude-1000/-home-r-common-0work-website-2-0/551ad676-fd29-4599-8790-88cf5234c1f0/scratchpad/sources/telegram.json` (анонсы с должностями: «X, Frontend-разработчик в Y, расскажет…»).
  Строки таблицы без номера митапа игнорировать — их спикеры есть на старом сайте.
- Уже есть: `anna-rastorgueva`, `daria-egorova`, `denis-makushin` в `packages/content/src/speakers/{ru,en}/` —
  не пересоздавать, а включить в реестр. `role` у спикера стала необязательной (задача 01).
- Формат файла: как `packages/content/src/speakers/ru/anna-rastorgueva.md` (без `photo` — портреты делают задачи 08–09).
  `links` — только https-ссылки на профили из источников (Telegram, GitHub), если они там есть.
- Slug: транслитерация канонического русского имени «имя-фамилия» латиницей (`aleksey-okhrimenko`),
  только `[a-z0-9-]`. Канон имени — полное имя из самого позднего источника (`Сергей Попов`, а не `Серёжа`).
- На старом сайте 30-го митапа фото `alexandra-maltseva.png`, а в тексте «Анастасия Мальцева» — имя брать из текста,
  slug `anastasiya-maltseva`; занести в отчёт как расхождение.
- Должность (`role`): из самого позднего источника, где она названа; формулировка источника. Нет — поле не заполнять.
- Реестр CSV, колонки: `slug,name_ru,name_en,variants,role_ru,role_en,role_source` (`variants` — все написания из
  источников через `|`, `role_source` — откуда должность: `sheet`, `old-site:28`, `telegram:<id>` или пусто).

## Steps
1. Собрать все имена из таблицы (митапы 1–27 и онлайн-выпуски) и старого сайта (28–30), нормализовать (убрать
   U+200B, пробелы, привести порядок), склеить варианты одного человека. Сомнение — разные люди, отметить в отчёте.
2. Найти должности в Telegram и на старом сайте.
3. Записать `speakers.csv` и файлы `speakers/ru/<slug>.md`, `speakers/en/<slug>.md` (en: транслит имени, перевод должности).

## Done when
- [ ] `pnpm --filter website build && pnpm test` → код 0 (AC-10)
- [ ] `python3 -I -c "import csv;r=list(csv.DictReader(open('plans/002-meetup-archive/speakers.csv')));s=[x['slug'] for x in r];assert len(s)==len(set(s));print(len(s))"` → число без ошибки, нет дублей slug (AC-3)
- [ ] у каждого slug из реестра есть `speakers/ru/<slug>.md` и `speakers/en/<slug>.md` (AC-3)
- [ ] `grep -c "Охрименко" plans/002-meetup-archive/speakers.csv` → 1: один Алексей Охрименко на все его митапы (AC-3)

## Must not
- выдумывать должность или ссылку; «восстанавливать» имя, которого нет ни в одном источнике
- создавать или менять события и доклады; трогать файлы вне `owns`
- удалять или переименовывать существующих спикеров

## Report
Полный результат — в `plans/002-meetup-archive/tasks/reports/02-report.md` (склейки вариантов имён, спорные случаи,
спикеры без должности). Вернуть только: статус, строку итога, файлы, `contract: <digest>`.

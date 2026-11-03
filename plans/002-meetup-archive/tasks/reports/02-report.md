# Report 02 · speaker registry

Status: DONE. contract: e9668572

Result: 85 speakers in `plans/002-meetup-archive/speakers.csv`; 82 new files in each of `speakers/ru` and `speakers/en`
(plus the 3 existing speakers, untouched: anna-rastorgueva, daria-egorova, denis-makushin; they are in the registry).
No `photo` field in any new file. Done-when: `pnpm --filter website build && pnpm test` exit 0 (169 tests, build served from turbo cache);
CSV slug uniqueness OK (85); every slug has ru and en file; `grep -c Охрименко` = 1.

## Merges of name variants (one person)
- Сергей Попов = «Серёжа Попов» (meetup 9; the Telegram post 38 also says «Серёжа ... боль про HTML»). Assumption: same person as the speaker of meetups 2 and 5.
- Алексей Попков = «Леша Попков» (Telegram 86).
- Александра Шинкевич = «Саша Шинкевич» (Telegram 53).
- Роман Троицкий = «Троицкий Роман» (sheet 19), «Рома Троицкий» (old site 29).
- Анна Расторгуева = «Расторгуева Анна» (sheet 25) = existing file.
- Order "Фамилия Имя" in sheet 16, 18, 19, 23, 25: Крохмаль Даниил, Шкульник Дмитрий, Оловянников Илья, Валитова София, Коршиков Павел, Соломка Сергей, Сережникова Наталья.
- U+200B stripped from the names of meetups 10 (and from talk titles; not touched here).
- Алексей Охрименко: one person across meetups 1, 4, 7, 12.
- Мальцева: old-site photo file `alexandra-maltseva.png` vs text «Анастасия Мальцева»; name taken from the text, slug `anastasiya-maltseva` (as the task says). Telegram 361 calls her «Анастасия Мальцева (Егорова)».

## Doubtful cases (kept as separate people or kept as written)
- «Дима Короле» (meetup 8): looks truncated («Королев»?), but the name is not restored; name_ru = «Дима Короле», slug `dima-korole`. Editor should confirm.
- Diminutive-only names with no fuller form in any source: Саша Ермоленко, Миша Розов, Маша Стогова, Алекс Редер. Kept as written.
- Анастасия Мальцева (Егорова) is NOT Дарья Егорова (existing speaker); different first name, kept separate.
- Андрей Смирнов (meetup 3) assumed to be one person; Telegram 309 describes a «Андрей Смирнов, ведущий подкаста Frontend Weekend» but it does not tie him to the talk, so no role taken.
- Арсений Попов and Сергей Попов kept as different people (different first names).
- Telegram 353 links Никита Дубко to t.me/mefody_dev (blog); not added to `links` (not a profile link given for the speaker's talk). Only links added: Telegram of Анастасия Шек (t.me/anastasia_shek_site, tg 360) and Анастасия Мальцева (t.me/CosyFrontendNastia, tg 361).
- Alina Ваниева slug is `alina-vanieva` (plain transliteration of the surname).
- Slugs of the already-present portrait assets (alexander-nikulin, alexandra-fomakina, anastasiya-maltseva, anastasiya-shek, anna-lapa, anton-volkov, dmitry-borisenko, roman-ganin, roman-troitsky) match the registry slugs.
- Rows without a meetup number in the sheet were used only for names (all of them appear on the old site 28-30): Николай Константинов and Анастасия Ярош (meetup 27 per Telegram), Никулин, Волков, Фомакина, Борисенко, Троицкий, Лапа. «Coming soon» row ignored.

## Roles
- Taken from the latest source that names one, in the source's wording (first letter capitalised where the source wrote lower case).
- Many sources give only a company, not a job title ("Анна Ширяева — СИБУР Цифровой", "Алексей Попков из Яндекса"). These were taken as the role verbatim (company name only). If the editors want only real job titles, these are the rows to blank: all where role_ru is a bare company name (VK, Яндекс, Циан, Сбер, Сбербанк, X5 Digital, Cloud.ru, Авито, Транстелематика, Цифромед, А-Софт, Sendsay, Тинькофф, СберКорус, Студия разработки SPOT, СИБУР Цифровой, red_mad_robot, ПАО Сбербанк, Sellerscale, FrontendBlok, Школа 21, Moscow Business Academy).
- Role for the 3 existing speakers copied from their files; `role_source` empty for them (not one of sheet/old-site/telegram). Note: Telegram 381 says Анна Расторгуева «frontend-разработчик из Сбера» and old site 28 «ПАО Сбербанк»; her file («Frontend-разработчик из бигтеха») was left unchanged as instructed.
- Where old site and Telegram disagree, the later (old site, post-event) wins: Роман Ганин «Frontend-разработчик» (Telegram 362 had the longer «... и руководитель направления в Сбере»); Анастасия Шек «UX/UI дизайнер» (Telegram 360 had a longer bio); Роман Троицкий from old-site 29 over Telegram 177 (Комус-тех).
- English role: translation by me; company names transliterated/translated (Сбер → Sber, Авито → Avito, Циан → Cian, Тинькофф → Tinkoff, etc.), «АБК»/«БАРС Груп» transliterated.

## Speakers without a role (37, see role_ru empty in the CSV)
Охрименко, Арсений Попов, Григоров, Сергей Попов, Пушкарская, Семёнова, Михалевский, Смирнов, Панов, Лебедев, Лесневский, Нечунаев, Ермоленко, Розов, Виноградов, Шаталов, Короле, Ветров, Петухов, Редер, Прилепский, Долженко, Лыкасов, Дубровская, Бузин, Шинкевич, Борисов, Фролова, Смелкова, Плесовчких, Бабков, Крохмаль, Морозов Н., Коробов, Коршиков, Иванов, Галковская.

## Not done / follow-ups
- Latin spelling of names in `name_en` is mine (scheme: ё→e, ий→y, х→kh, ж→zh); no source gives English names.
- Tooling: scripts in the scratchpad `work02/` (people.py, gen.py).

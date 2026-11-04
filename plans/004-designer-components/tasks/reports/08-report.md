# Задача 08, отчёт записан дирижёром

Коллекция `organizers` с обязательным `status` и контактами `contacts.telegram|github|website`, генератор `pnpm new:organizer`, чистые `organizersByStatus` и `contactsOf` с тестами, карточка и секция после ЧАВО. Расхождение `status` и `contacts` между языками роняет проверку каталога.

Дирижёр перенёс фото в `organizers/assets/` по правилу пакета и заменил локальные константы ширины токеном `vars.adaptive.organizerWidth`. Агентский Markdown и JSON-LD организаторов пока не знают, в задаче этого нет.

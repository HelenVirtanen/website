# Отчёт задачи 02 (remove-legacy-root-layout)
Статус: DONE
- `git rm -r` выполнен для src, public, scripts, astro.config.mjs, tsconfig.json, gitignore, npmrc, apps/website/src/Новая папка (20 файлов, пути индекса удалены).
- moscowcss-site.code-workspace ссылается только на существующие пути, правка не нужна.
- grep extract-partner-cards-wave|menucards: ссылки остались только в plans/ (документация плана, вне owns).
- Done when: git ls-files пусто; .gitignore/.npmrc/eslint.config.js/apps/website/public/assets/partner-cards-wave.svg на месте; pnpm lint && pnpm build exit 0.
contract: 621371f0

# 09 report: DONE_WITH_CONCERNS
Сделано: seo/pages.ts(+test), страницы events/talks/speakers, components/{EntityPage,EventSchedule,JoinSection}, словарь ru/en, JoinBlock/MapPlaceholder на пропсы (+стори).
Done when: build, lint, build:storybook, test(43), px-grep пусто, dist по маршрутам — ок.
Снимки (.visual/t09 vs baseline, с --ignore): 165 файлов, 5 ошибок = новая стори JoinBlock English (НЕТ В БАЗЕ), остальное 0%.
Вне owns (нужна правка нарезки):
- sections/PartnerSection.astro: передать в MapPlaceholder emptyLabel={t('map.empty')} emptyHint={t('map.emptyHint')} openLabel={t('map.open')}; без этого ссылка «открыть на карте» пустая.
- sections/HeroSection.astro: не рендерить <a href=""> без streamUrl.
- sections/JoinSection.astro теперь не используется (заменён components/JoinSection.astro) — удалить.
- layouts/BaseLayout.astro: навбар-якоря #registration/#program/... на подстраницах мертвы.
- Sharp не установлен: Image из astro:assets роняет сборку, фото спикера — обычный <img>.

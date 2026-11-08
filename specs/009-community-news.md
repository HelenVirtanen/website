# 009 — Community news

## Problem

What happens between meetups (a stand at a conference, new organizers, the new site, a contest) lived only in
the Telegram channel. The site had no place for it, and the header spent two slots on Talks and Speakers, which are
already tabs of History.

## Decisions

- **Name.** «Новости» / News, at `/news/` and `/news/<name>/`. «События» would clash with meetups, which the site
  calls «История»; the posts are short announcements and reports, not articles, so not a blog.
- **Content.** Collection `news/<lang>/<name>.md`: `title` (≤ 90), `date` (a day), `description` (50–160: card text,
  lead and meta description), translated `tags`, optional `cover` and `gallery` (`image` + `alt`), `links`, body
  required. `date` and gallery files must match `ru`; `cover` and `links` may differ (a cover can carry text, site links
  point to their own language). Organizer news use covers drawn by `renderTalkCover` from the unedited photo.
  New entries: `pnpm new:news <name>` (dated today).
- **List.** A `list` page of kind `news` (`LIST_KINDS`), rendered by `ArchivePage` without the History tabs:
  `NewsCard`s newest first, filter by words, year, topic (`?topic=`) and photos, the same pure filter as the other
  lists. Without JavaScript the whole list shows.
- **Page.** Chip back to the list, date, title, description as lead, coloured topic pills that open the filtered list,
  link pills; the cover in a framed box on the right; the body panel; the gallery (one `Lightbox` with the cover);
  a «Раньше / Позже» pager; «Другие новости»: three cards, shared topics first, then nearest by date, the pager's
  neighbours last.
- **Agents and SEO.** `NewsArticle` JSON-LD, an OG card per news item, the Markdown twin, `news` rows in
  `archive.json`, WebMCP `list_news` and `get_news`, and `kind: news` in `list_archive`. llms.txt lists news in the
  index.
- **RSS.** One news feed per language, like the blog: `/news/rss.xml` and `/en/news/rss.xml`, full text, topics as
  categories, linked from the `<head>` of the news pages and from the list.
- **Header.** About, History, Reviews, News, Help the meetup, Search. Talks and Speakers stay in the burger menu
  only, after Help; History is current on talk and speaker pages too.

## Out of scope

- News on the home page.

## Acceptance

1. `/news/` and `/en/news/` list the published news newest first; drafts are absent.
2. The filter narrows by words, year, topic and photos and keeps the state in the address.
3. A news page shows title, date, description, cover or gallery when present, links and other news.
4. The wide header has no Talks and Speakers; the burger menu has them after Help.
5. `pnpm lint`, `pnpm test`, `pnpm build`, `check:seo` and `check:a11y` pass.

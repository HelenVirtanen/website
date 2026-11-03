import {
  loadCatalog,
  localeOf,
  slugOf,
  type Catalog,
  type CatalogEntry,
  type DocumentEntry,
  type EventEntry,
  type SpeakerEntry,
  type TalkEntry,
} from '../content/catalog';
import { defaultLocale, localizePath, locales, type Locale } from '../i18n';

// Единый источник «какие страницы публичны и где они живут»: из него строятся маршруты,
// карточки Open Graph и проверки, поэтому состав страниц не может разойтись между ними.

type PageEntry = CatalogEntry<{ title: string; description: string }>;

export interface Alternate {
  locale: Locale;
  /** Путь от корня сайта со слэшем на конце: `/en/events/31/`, главная — `/` */
  path: string;
}

interface Base {
  locale: Locale;
  /** Путь от корня сайта со слэшем на конце */
  path: string;
  /** Параметр маршрута `[event]`/`[talk]`/`[speaker]`; у главной нет */
  slugParam: string | undefined;
  /** Версии этой страницы на всех языках, включая её саму: hreflang и переключатель */
  alternates: Alternate[];
}

export type PublicPage =
  | (Base & { kind: 'home'; entry: PageEntry })
  | (Base & { kind: 'event'; entry: EventEntry })
  | (Base & { kind: 'talk'; entry: TalkEntry })
  | (Base & { kind: 'speaker'; entry: SpeakerEntry })
  | (Base & { kind: 'document'; entry: DocumentEntry });

type Kind = PublicPage['kind'];

// Документ живёт прямо под языком, без папки раздела: `/privacy/`.
const SECTION: Record<Exclude<Kind, 'home' | 'document'>, string> = {
  event: 'events',
  talk: 'talks',
  speaker: 'speakers',
};

const enabled = new Set<string>(locales);
const isEnabled = (entry: { id: string }): boolean => enabled.has(localeOf(entry));
const isPublished = (entry: { data: { draft: boolean } }): boolean => !entry.data.draft;

/** Срезает слэши в конце без регулярки (`/\/+$/` даёт квадратичный бэктрекинг). */
export function trimTrailingSlashes(path: string): string {
  let end = path.length;
  while (end > 0 && path[end - 1] === '/') end -= 1;
  return path.slice(0, end);
}

const pathOf = (kind: Kind, locale: Locale, slug: string): string =>
  kind === 'home'
    ? localizePath(locale)
    : localizePath(locale, kind === 'document' ? slug : `${SECTION[kind]}/${slug}`);

/**
 * Публичные страницы по готовому каталогу: главная, митапы, доклады, спикеры и документы каждого
 * включённого языка, без черновиков. Чистая функция — тестируется без `astro:content`.
 */
export function publicPagesOf(
  catalog: Pick<Catalog, 'events' | 'talks' | 'speakers'> & { pages: PageEntry[]; documents?: DocumentEntry[] },
): PublicPage[] {
  const raw: { kind: Kind; entry: PageEntry | EventEntry | TalkEntry | SpeakerEntry | DocumentEntry }[] = [
    ...catalog.pages
      .filter((entry) => slugOf(entry) === 'index')
      .map((entry) => ({ kind: 'home' as const, entry })),
    ...catalog.events.filter(isPublished).map((entry) => ({ kind: 'event' as const, entry })),
    ...catalog.talks.filter(isPublished).map((entry) => ({ kind: 'talk' as const, entry })),
    ...catalog.speakers.filter(isPublished).map((entry) => ({ kind: 'speaker' as const, entry })),
    ...(catalog.documents ?? []).filter(isPublished).map((entry) => ({ kind: 'document' as const, entry })),
  ].filter(({ entry }) => isEnabled(entry));

  // Переводы одной страницы делят вид и имя файла.
  const groups = new Map<string, Alternate[]>();
  for (const { kind, entry } of raw) {
    const locale = localeOf(entry) as Locale;
    const key = `${kind}:${slugOf(entry)}`;
    groups.set(key, [...(groups.get(key) ?? []), { locale, path: pathOf(kind, locale, slugOf(entry)) }]);
  }

  return raw.map(({ kind, entry }) => {
    const locale = localeOf(entry) as Locale;
    const slug = slugOf(entry);
    const alternates = (groups.get(`${kind}:${slug}`) ?? []).sort(
      (a, b) => locales.indexOf(a.locale) - locales.indexOf(b.locale),
    );
    return {
      kind,
      entry,
      locale,
      path: pathOf(kind, locale, slug),
      slugParam: kind === 'home' ? undefined : slug,
      alternates,
    } as PublicPage;
  });
}

/** Публичные страницы сайта по контенту, проверенному `loadCatalog`. */
export async function publicPages(): Promise<PublicPage[]> {
  return publicPagesOf(await loadCatalog());
}

/** Страницы одного вида: источник `getStaticPaths` соответствующего маршрута. */
export const pagesOfKind = <K extends Kind>(pages: readonly PublicPage[], kind: K) =>
  pages.filter((page): page is Extract<PublicPage, { kind: K }> => page.kind === kind);

/** Параметр `[...locale]`: у языка по умолчанию его нет, поэтому ru живёт без префикса. */
export const localeParam = (locale: Locale): Locale | undefined =>
  locale === defaultLocale ? undefined : locale;

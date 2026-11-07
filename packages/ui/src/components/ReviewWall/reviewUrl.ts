export const REVIEW_PARAM = 'review';

/** Постоянный адрес отзыва: страница и параметр. */
export const reviewHref = (pagePath: string, slug: string): string =>
  `${pagePath}?${REVIEW_PARAM}=${encodeURIComponent(slug)}`;

/** Адрес стикера: без скрипта окно раскрывает `:target`, со скриптом якорь убирается. */
export const stickerHref = (pagePath: string, slug: string): string => `${reviewHref(pagePath, slug)}#review-${slug}`;

/** Адрес с окном или без него: чужие параметры (`utm_*`) остаются, якорь нет. */
export function withReview(url: URL, slug: string | undefined): string {
  const next = new URL(url);
  if (slug === undefined) next.searchParams.delete(REVIEW_PARAM);
  else next.searchParams.set(REVIEW_PARAM, slug);
  next.hash = '';
  return next.href;
}

export const CATEGORY_PARAM = 'category';

/** Адрес с фильтром или без него; открытое окно и чужие параметры остаются. */
export function withCategory(url: URL, category: string | undefined): string {
  const next = new URL(url);
  if (category === undefined) next.searchParams.delete(CATEGORY_PARAM);
  else next.searchParams.set(CATEGORY_PARAM, category);
  return next.href;
}

/** Выбранная категория; неизвестное значение в адресе значит «все отзывы». */
export function categoryOf(url: URL, known: ReadonlySet<string>): string | undefined {
  const asked = url.searchParams.get(CATEGORY_PARAM);
  return asked !== null && known.has(asked) ? asked : undefined;
}

export interface ReviewTarget {
  /** Какое окно открыть по адресу */
  open: string | undefined;
  /** Адрес надо заменить: неизвестное имя в параметре или якорь с версии без скрипта */
  cleanUrl: string | undefined;
}

/** Что адрес значит для стены: единственное место, где адрес превращается в открытое окно. */
export function targetOf(url: URL, known: ReadonlySet<string>): ReviewTarget {
  const asked = url.searchParams.get(REVIEW_PARAM);
  if (asked === null) return { open: undefined, cleanUrl: undefined };
  if (!known.has(asked)) return { open: undefined, cleanUrl: withReview(url, undefined) };
  return { open: asked, cleanUrl: url.hash === '' ? undefined : withReview(url, asked) };
}

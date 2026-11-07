import { describe, expect, it } from 'vitest';
import { page, review, speaker, twoMeetupsCatalog } from '../test/fixtures';
import { publicPagesOf } from '../seo/pages';
import { CatalogError, validateCatalog } from './catalog';
import { previewOf, publishedReviews } from './reviews';

describe('publishedReviews', () => {
  it('отбирает язык, убирает черновики и идёт по имени файла', () => {
    const entries = [
      review('ru/vera'),
      review('en/vera'),
      review('ru/anna'),
      review('ru/gleb', { draft: true }),
    ];
    expect(publishedReviews(entries, 'ru').map((entry) => entry.id)).toEqual(['ru/anna', 'ru/vera']);
  });
});

describe('previewOf', () => {
  it('берёт первый абзац и пропускает заголовок перед ним', () => {
    expect(previewOf('<h3>Мой путь</h3>\n<p>Первый.</p>\n<p>Второй.</p>')).toBe('Первый.');
  });

  it('убирает разметку и раскодирует сущности', () => {
    expect(previewOf('<p>Смотри <a href="https://x.test">пост</a> &#x26; <em>вывод</em> &lt;3</p>')).toBe('Смотри пост & вывод <3');
  });

  it('длинный текст режет по границе слова и ставит многоточие', () => {
    expect(previewOf('<p>Один два, три четыре</p>', 10)).toBe('Один два…');
    expect(previewOf('<p>Один два</p>', 8)).toBe('Один два');
    expect(previewOf('<p>Оченьдлинноеслово</p>', 5)).toBe('Очень…');
  });

  it('без абзаца берёт весь текст', () => {
    expect(previewOf('<ul>\n<li>Раз</li>\n<li>Два</li>\n</ul>')).toBe('Раз Два');
  });
});

describe('проверка каталога', () => {
  const problemsOf = (reviews: ReturnType<typeof review>[]): string => {
    try {
      validateCatalog({ ...twoMeetupsCatalog(), reviews });
      return '';
    } catch (error) {
      if (error instanceof CatalogError) return error.message;
      throw error;
    }
  };

  it('пропускает отзыв на двух языках', () => {
    expect(problemsOf([review('ru/anna'), review('en/anna', { name: 'Anna Ivanova' })])).toBe('');
  });

  it('роняет сборку на пустом тексте', () => {
    expect(problemsOf([review('ru/anna', {}, '  ')])).toContain('reviews/ru/anna.md: текст файла пуст');
  });

  it('роняет сборку на переводе без оригинала и на другом фото', () => {
    expect(problemsOf([review('en/anna')])).toContain('reviews/en/anna.md: нет оригинала');
    const photo = { src: '/a.jpg', width: 1, height: 1, format: 'jpg' } as const;
    expect(problemsOf([review('ru/anna', { photo }), review('en/anna')])).toContain('reviews/en/anna.md: поле photo');
  });

  it('роняет сборку на других файлах галереи, но не на переводе описания', () => {
    const image = (src: string) => ({ src, width: 1, height: 1, format: 'jpg' }) as const;
    const ru = review('ru/anna', { gallery: [{ image: image('/a.jpg'), alt: 'Снимок' }] });
    expect(problemsOf([ru, review('en/anna', { gallery: [{ image: image('/a.jpg'), alt: 'A photo' }] })])).toBe('');
    expect(problemsOf([ru, review('en/anna', { gallery: [{ image: image('/b.jpg'), alt: 'A photo' }] })])).toContain(
      'reviews/en/anna.md: поле gallery[].image',
    );
  });
});

describe('страница отзывов в списке публичных', () => {
  const base = {
    events: [],
    talks: [],
    speakers: [speaker('ru/daria-egorova')],
    pages: [page('ru/index')],
  };

  it('нет опубликованных отзывов — нет страницы', () => {
    const pages = publicPagesOf({ ...base, reviews: [review('ru/anna', { draft: true })] });
    expect(pages.some((item) => item.kind === 'reviews')).toBe(false);
  });

  it('первый отзыв создаёт страницу языка со ссылками на обе версии', () => {
    const pages = publicPagesOf({ ...base, reviews: [review('ru/anna'), review('en/anna')] });
    expect(pages.filter((item) => item.kind === 'reviews').map((item) => item.path)).toEqual(['/reviews/', '/en/reviews/']);
    expect(pages.find((item) => item.kind === 'reviews')?.alternates.map((item) => item.path)).toEqual(['/reviews/', '/en/reviews/']);
  });
});

import { describe, expect, it } from 'vitest';
import { categoryOf, reviewHref, stickerHref, targetOf, withCategory, withReview } from './reviewUrl';

const known = new Set(['anna-lapa', 'aleksandr-litvin']);
const page = 'https://css.moscow/reviews/';

describe('адреса отзыва', () => {
  it('постоянный адрес — страница и параметр, адрес стикера ещё и с якорем', () => {
    expect(reviewHref('/en/reviews/', 'anna-lapa')).toBe('/en/reviews/?review=anna-lapa');
    expect(stickerHref('/reviews/', 'anna-lapa')).toBe('/reviews/?review=anna-lapa#review-anna-lapa');
  });

  it('открытие и закрытие не трогают чужие параметры и убирают якорь', () => {
    const url = new URL(`${page}?utm_source=tg#x`);
    expect(withReview(url, 'anna-lapa')).toBe(`${page}?utm_source=tg&review=anna-lapa`);
    expect(withReview(new URL(`${page}?utm_source=tg&review=anna-lapa`), undefined)).toBe(`${page}?utm_source=tg`);
    expect(withReview(new URL(`${page}?review=anna-lapa`), undefined)).toBe(page);
  });

  it('повторное открытие не плодит параметр', () => {
    expect(withReview(new URL(`${page}?review=anna-lapa`), 'aleksandr-litvin')).toBe(`${page}?review=aleksandr-litvin`);
  });
});

describe('фильтр в адресе', () => {
  const categories = new Set(['speaker', 'partner']);

  it('читает известную категорию, неизвестная значит все отзывы', () => {
    expect(categoryOf(new URL(`${page}?category=speaker`), categories)).toBe('speaker');
    expect(categoryOf(new URL(`${page}?category=nope`), categories)).toBeUndefined();
    expect(categoryOf(new URL(page), categories)).toBeUndefined();
  });

  it('ставит и убирает фильтр, не трогая окно и чужие параметры', () => {
    expect(withCategory(new URL(`${page}?utm_source=tg&review=anna-lapa`), 'speaker')).toBe(`${page}?utm_source=tg&review=anna-lapa&category=speaker`);
    expect(withCategory(new URL(`${page}?category=speaker&utm_source=tg`), undefined)).toBe(`${page}?utm_source=tg`);
  });

  it('открытие окна не сбрасывает фильтр', () => {
    expect(withReview(new URL(`${page}?category=speaker`), 'anna-lapa')).toBe(`${page}?category=speaker&review=anna-lapa`);
  });
});

describe('targetOf', () => {
  it('без параметра ничего не открывает и адрес не меняет', () => {
    expect(targetOf(new URL(`${page}?utm_source=tg`), known)).toEqual({ open: undefined, cleanUrl: undefined });
  });

  it('известное имя открывает окно', () => {
    expect(targetOf(new URL(`${page}?review=anna-lapa`), known)).toEqual({ open: 'anna-lapa', cleanUrl: undefined });
  });

  it('неизвестное имя ничего не открывает и убирает только свой параметр', () => {
    expect(targetOf(new URL(`${page}?review=nope&utm_source=tg`), known)).toEqual({
      open: undefined,
      cleanUrl: `${page}?utm_source=tg`,
    });
  });

  it('пустой параметр считается неизвестным именем', () => {
    expect(targetOf(new URL(`${page}?review=`), known)).toEqual({ open: undefined, cleanUrl: page });
  });

  it('якорь версии без скрипта убирается, окно остаётся', () => {
    expect(targetOf(new URL(`${page}?review=anna-lapa#review-anna-lapa`), known)).toEqual({
      open: 'anna-lapa',
      cleanUrl: `${page}?review=anna-lapa`,
    });
  });
});

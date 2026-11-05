import { resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { coverFileOf, isWide } from './talk-cover';

vi.mock('astro:content', () => ({ getCollection: vi.fn() }));

describe('coverFileOf', () => {
  const filePath = 'packages/content/src/talks/ru/svg.md';

  it('путь из frontmatter разрешается от файла доклада', () => {
    const source = '---\nevent: "22"\ncover: ../assets/svg.jpg\n---\nТекст';
    expect(coverFileOf({ filePath }, () => source)).toBe(resolve('packages/content/src/talks/assets/svg.jpg'));
  });

  it('кавычки вокруг пути не мешают; без обложки и без файла — undefined', () => {
    expect(coverFileOf({ filePath }, () => 'cover: "../assets/a b.jpg"\n')).toBe(resolve('packages/content/src/talks/assets/a b.jpg'));
    expect(coverFileOf({ filePath }, () => '---\ntitle: "x"\n---\n')).toBeUndefined();
    expect(coverFileOf({ filePath: undefined }, () => 'cover: x.jpg')).toBeUndefined();
  });
});

describe('isWide', () => {
  it('16:9 и 1200×630 — широкие, квадрат и портрет — нет', () => {
    expect(isWide({ width: 1280, height: 720 })).toBe(true);
    expect(isWide({ width: 1200, height: 630 })).toBe(true);
    expect(isWide({ width: 1200, height: 1200 })).toBe(false);
    expect(isWide({ width: 720, height: 1280 })).toBe(false);
  });
});

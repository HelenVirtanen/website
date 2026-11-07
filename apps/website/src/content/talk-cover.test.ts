import { resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { event, speaker, talk } from '../test/fixtures';
import { coverFileOf, frontmatterFileOf, isWide, talkCoverPath, talkCoverSourceOf } from './talk-cover';

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

describe('frontmatterFileOf', () => {
  it('находит фото спикера по имени поля', () => {
    const source = '---\nname: "Анна"\nphoto: ../assets/anna.jpg\n---\n';
    expect(frontmatterFileOf({ filePath: 'packages/content/src/speakers/ru/anna.md' }, 'photo', () => source)).toBe(
      resolve('packages/content/src/speakers/assets/anna.jpg'),
    );
  });
});

describe('обложка доклада без карточки', () => {
  it('адрес по языку и имени файла', () => {
    expect(talkCoverPath({ id: 'en/svg' })).toBe('/covers/en/svg.png');
  });

  it('метка митапа, спикеры языка доклада и фото первого спикера с фото', () => {
    const catalog = {
      events: [event('ru/7'), event('ru/online-2021', { date: new Date('2021-03-01') })],
      speakers: [
        speaker('ru/no-photo', { name: 'Без Фото' }),
        { ...speaker('ru/with-photo', { name: 'С Фото', photo: { src: '/x.jpg', width: 1, height: 1, format: 'jpg' } }), filePath: 'packages/content/src/speakers/ru/with-photo.md' },
        speaker('en/with-photo', { name: 'With Photo' }),
      ],
    };
    const read = () => 'photo: ../assets/with-photo.jpg\n';
    const source = talkCoverSourceOf(talk('ru/x', { event: '7', speakers: ['no-photo', 'with-photo'], title: 'Доклад' }), catalog, read);
    expect(source).toEqual({
      label: 'MOSCOWCSS_7',
      title: 'Доклад',
      speakers: 'Без Фото, С Фото',
      photoFile: resolve('packages/content/src/speakers/assets/with-photo.jpg'),
    });
    expect(talkCoverSourceOf(talk('ru/y', { event: 'online-2021', speakers: ['no-photo'] }), catalog, read).label).toBe('MOSCOWCSS_2021');
  });
});

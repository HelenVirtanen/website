import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { locales } from '../src/i18n/config';
import { load as parseYaml } from 'js-yaml';
import { z } from 'astro/zod';
import {
  EventSchema,
  FaqSchema,
  createOrganizerSchema,
  createPartnerSchema,
  createReviewSchema,
  createTalkSchema,
  createSpeakerSchema,
  createCommunitySchema,
  createNewsSchema,
  DocumentSchema,
} from '@moscowcss/content/schema';
import { DEFAULT_DIRS, isoDate, KINDS, LOCALES, planEntry, runNewEntry } from './new-entry.mjs';

// Схема коллекции по типу заготовки; картинки в схеме — `image()`, здесь достаточно строки пути.
const SCHEMAS = {
  event: EventSchema,
  talk: createTalkSchema(() => z.string()),
  speaker: createSpeakerSchema(() => z.string()),
  partner: createPartnerSchema(() => z.string()),
  faq: FaqSchema,
  organizer: createOrganizerSchema(() => z.string()),
  review: createReviewSchema(() => z.string()),
  community: createCommunitySchema(() => z.string()),
  news: createNewsSchema(() => z.string()),
  document: DocumentSchema,
};

// Шаблоны настоящие (packages/content/templates), контент во временной папке: тест ловит и поломку
// шаблона, и поломку скрипта, не трогая реальный контент.
const today = new Date(2026, 6, 9);
let content;
let dirs;
const quiet = { log: () => undefined, error: () => undefined };

beforeEach(() => {
  content = mkdtempSync(join(tmpdir(), 'new-entry-'));
  dirs = { content, templates: DEFAULT_DIRS.templates };
});
afterEach(() => rmSync(content, { recursive: true, force: true }));

const read = (...parts) => readFileSync(join(content, ...parts), 'utf8');
const put = (text, ...parts) => {
  mkdirSync(join(content, ...parts.slice(0, -1)), { recursive: true });
  writeFileSync(join(content, ...parts), text);
};

describe('new-entry', () => {
  it('языки скрипта совпадают с языками сайта', () => {
    expect(LOCALES).toEqual([...locales]);
  });

  it('дата — местная, в формате frontmatter', () => {
    expect(isoDate(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  it('шаблоны есть для каждого языка и типа и не лежат в src', () => {
    for (const locale of LOCALES) {
      for (const kind of Object.keys(KINDS)) {
        expect(existsSync(join(DEFAULT_DIRS.templates, locale, `${kind}.md`))).toBe(true);
      }
    }
    expect(DEFAULT_DIRS.templates.startsWith(DEFAULT_DIRS.content)).toBe(false);
  });

  it('митап — два черновика с датой и номером, без остатков плейсхолдеров', () => {
    expect(runNewEntry(['event', '99'], { today, dirs, ...quiet })).toBe(0);
    for (const locale of LOCALES) {
      const text = read('events', locale, '99.md');
      expect(text).toContain('date: 2026-07-09');
      expect(text).toContain('draft: true');
      expect(text).toContain('99');
      expect(text).not.toContain('{{');
    }
  });

  it.each(['talk', 'speaker'])('%s — черновики на всех языках', (kind) => {
    expect(runNewEntry([kind, 'some-name'], { today, dirs, ...quiet })).toBe(0);
    for (const locale of LOCALES) {
      const text = read(KINDS[kind].collection, locale, 'some-name.md');
      expect(text).toContain('draft: true');
      expect(text).not.toContain('{{');
    }
  });

  it('спикер — без фото: сайт нарисует аватар, заглушку не копируем', () => {
    runNewEntry(['speaker', 'some-name'], { today, dirs, ...quiet });
    expect(existsSync(join(content, 'speakers', 'assets', 'some-name.jpg'))).toBe(false);
    expect(read('speakers', 'ru', 'some-name.md')).not.toMatch(/^photo:/m);
  });

  it('у каждого вида заготовок есть схема для проверки: новый вид не проходит мимо теста', () => {
    expect(Object.keys(SCHEMAS).sort()).toEqual(Object.keys(KINDS).sort());
  });

  it.each(['partner', 'faq', 'organizer'])('%s — заготовка на всех языках', (kind) => {
    expect(runNewEntry([kind, 'some-name'], { today, dirs, ...quiet })).toBe(0);
    for (const locale of LOCALES) {
      expect(existsSync(join(content, KINDS[kind].collection, locale, 'some-name.md'))).toBe(true);
    }
  });

  it.each(Object.keys(SCHEMAS))('%s — заготовка проходит схему, тело без HTML, это черновик', (kind) => {
    const name = kind === 'event' ? '99' : 'some-name';
    expect(runNewEntry([kind, name], { today, dirs, ...quiet })).toBe(0);
    for (const locale of LOCALES) {
      const text = read(KINDS[kind].collection, locale, `${name}.md`);
      const [, frontmatter = '', body = ''] = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text) ?? [];
      const data = SCHEMAS[kind].parse(parseYaml(frontmatter));
      expect(data.draft, `${kind}/${locale}`).toBe(true);
      // Сырой HTML (включая <!-- -->) сборка отклоняет — в заготовке его быть не должно.
      expect(body, `${kind}/${locale}`).not.toMatch(/</);
    }
  });

  it('файл уже есть — ничего не создаёт, чужой текст цел, код 1', () => {
    put('мой текст', 'talks', 'en', 'x.md');
    const errors = [];
    expect(runNewEntry(['talk', 'x'], { today, dirs, log: () => undefined, error: (msg) => errors.push(msg) })).toBe(1);
    expect(errors.join()).toContain('уже есть');
    expect(existsSync(join(content, 'talks', 'ru', 'x.md'))).toBe(false);
    expect(read('talks', 'en', 'x.md')).toBe('мой текст');
  });

  it.each([
    ['event', 'abc'],
    ['event', '0'],
    ['event', '3.5'],
    ['event', undefined],
    ['talk', 'Home_Lab'],
    ['speaker', 'a/b'],
    ['faq', ''],
  ])('%s «%s» — код 1 и ничего не создано', (kind, name) => {
    expect(() => planEntry({ kind, name, today, dirs })).toThrow(/имя/);
    expect(runNewEntry([kind, name], { today, dirs, ...quiet })).toBe(1);
    expect(existsSync(join(content, KINDS[kind].collection))).toBe(false);
  });

  it('неизвестный тип — код 1', () => {
    expect(() => planEntry({ kind: 'report', name: 'x', today, dirs })).toThrow(/тип/);
    expect(runNewEntry(['constructor', 'x'], { today, dirs, ...quiet })).toBe(1);
  });
});

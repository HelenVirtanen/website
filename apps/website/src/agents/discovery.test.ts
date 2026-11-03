import { createHash } from 'node:crypto';
import { describe, expect, it, vi } from 'vitest';
import { event, page, twoMeetupsCatalog } from '../test/fixtures';
import { publicPagesOf } from '../seo/pages';
import {
  aiCatalog,
  digestOf,
  jsonText,
  llmsTxt,
  SKILL_NAME,
  skillMarkdown,
  SKILLS_SCHEMA,
  skillsIndex,
} from './discovery';

vi.mock('astro:content', () => ({ getCollection: vi.fn() }));
vi.mock('astro:i18n', () => ({
  getRelativeLocaleUrl: (locale: string, path = '') =>
    `/${locale === 'ru' ? '' : `${locale}/`}${path === '' ? '' : `${path}/`}`,
}));

const site = new URL('https://css.moscow');

describe('skill', () => {
  it('SKILL.md: frontmatter с именем и описанием в кавычках, затем инструкция', () => {
    const text = skillMarkdown(site);
    const [, frontmatter = ''] = /^---\n([\s\S]*?)\n---\n/.exec(text) ?? [];
    expect(frontmatter).toMatch(new RegExp(`^name: ${SKILL_NAME}$`, 'm'));
    expect(frontmatter).toMatch(/^description: ".+"$/m);
    expect(text).toContain('https://css.moscow/events/31/index.md');
    expect(text).not.toMatch(/MCP server:|api-catalog/);
  });

  it('индекс по Agent Skills Discovery 0.2.0: digest — sha256 тех же байтов, что отдаёт SKILL.md', () => {
    const index = skillsIndex(site);
    const expected = createHash('sha256').update(Buffer.from(skillMarkdown(site), 'utf8')).digest('hex');
    expect(index.$schema).toBe(SKILLS_SCHEMA);
    expect(index.skills).toEqual([
      expect.objectContaining({
        name: SKILL_NAME,
        type: 'skill-md',
        url: 'https://css.moscow/.well-known/agent-skills/moscowcss/SKILL.md',
        digest: `sha256:${expected}`,
      }),
    ]);
    expect(SKILL_NAME).toMatch(/^[a-z0-9-]+$/);
  });

  it('digestOf считает от UTF-8, а не от кодов символов', () => {
    expect(digestOf('я')).toBe(`sha256:${createHash('sha256').update(Buffer.from([0xd1, 0x8f])).digest('hex')}`);
  });
});

describe('aiCatalog', () => {
  const catalog = aiCatalog(site);

  it('specVersion, host с идентификатором и непустые entries', () => {
    expect(catalog.specVersion).toBe('1.0');
    expect(catalog.host).toMatchObject({ displayName: expect.any(String), identifier: 'did:web:css.moscow' });
    expect(catalog.entries.length).toBeGreaterThan(0);
  });

  it('каждая запись: urn:air своего домена, тип, ровно один из url/data, 2–5 запросов', () => {
    for (const entry of catalog.entries) {
      expect(entry.identifier).toMatch(/^urn:air:css\.moscow:[a-z]+:[a-z0-9-]+$/);
      expect(entry.type).toMatch(/^[a-z]+\/[\w.+-]+$/);
      expect('url' in entry !== 'data' in entry).toBe(true);
      expect(entry.url.startsWith('https://css.moscow/')).toBe(true);
      expect(entry.representativeQueries.length).toBeGreaterThanOrEqual(2);
      expect(entry.representativeQueries.length).toBeLessThanOrEqual(5);
    }
  });

  it('JSON с переводом строки в конце', () => {
    expect(jsonText({ a: 1 })).toBe('{\n  "a": 1\n}\n');
  });
});

describe('llmsTxt', () => {
  const data = { ...twoMeetupsCatalog(), pages: [page('ru/index'), page('en/index')] };
  data.events.push(event('en/16', { date: new Date('2026-03-01T19:00:00+03:00'), tagline: 'Meetup 16' }));
  const now = new Date('2026-01-01T00:00:00+03:00');
  const text = llmsTxt(publicPagesOf(data), data, site, now, 'full');
  const index = llmsTxt(publicPagesOf(data), data, site, now);

  it('формат llmstxt.org: H1, цитата-резюме, затем секции H2', () => {
    const lines = text.split('\n');
    expect(lines[0]).toMatch(/^# /);
    expect(lines.find((line) => line.startsWith('>'))).toBeDefined();
    expect(lines.indexOf(lines.find((line) => line.startsWith('>')) ?? '')).toBeLessThan(lines.indexOf('## When to use'));
  });

  it('раздел When to use и ближайший митап', () => {
    expect(text).toContain('## When to use\n\n- A question about MoscowCSS');
    expect(text).toContain('Next meetup: [Meetup 16](https://css.moscow/en/events/16/index.md).');
  });

  it('каждая страница — ссылкой на свою Markdown-версию, по языкам', () => {
    expect(text).toContain('## Русский');
    expect(text).toContain('## English');
    expect(text).toContain('(https://css.moscow/events/10/index.md)');
    expect(text).toContain('(https://css.moscow/en/speakers/daria-egorova/index.md): Дизайнер');
    const links = [...text.matchAll(/\]\((https:\/\/[^)]+)\)/g)].map((match) => match[1] ?? '');
    for (const href of links.filter((url) => url.includes('/events/') || url.includes('/talks/'))) {
      expect(href.endsWith('/index.md')).toBe(true);
    }
  });

  it('оглавление: митапы и документы без докладов и спикеров, ссылка на полный список', () => {
    expect(index).toContain('(https://css.moscow/events/10/index.md)');
    expect(index).not.toContain('/talks/');
    expect(index).not.toContain('/speakers/');
    expect(index).toContain('[llms-full.txt](https://css.moscow/llms-full.txt)');
    expect(text).toContain('[llms.txt](https://css.moscow/llms.txt) is the short index');
  });
});

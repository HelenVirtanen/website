import { describe, expect, it } from 'vitest';
import { isExternalUrl, isSafeUrl, markdownSafetyPlugin, MarkdownSafetyError } from './markdown-safety';

const set: [string, unknown][] = [];
const ctx = {
  fileURL: new URL('file:///repo/packages/content/src/talks/ru/x.md'),
  setProperty: (_node: unknown, key: string, value: unknown) => {
    set.push([key, value]);
  },
};

describe('isSafeUrl', () => {
  it('https, mailto, адреса сайта и якоря безопасны', () => {
    for (const url of ['https://t.me/moscowcss', 'mailto:hi@css.moscow', '/events/31/', '../assets/a.jpg', '#program', 'talks/x/']) {
      expect(isSafeUrl(url), url).toBe(true);
    }
  });

  it('javascript:, data:, vbscript:, http: и javascript с табом в схеме — опасны', () => {
    for (const url of ['javascript:alert(1)', 'JAVASCRIPT:alert(1)', ' javascript:alert(1)', 'java\tscript:alert(1)', 'data:text/html,x', 'vbscript:x', 'http://example.com']) {
      expect(isSafeUrl(url), JSON.stringify(url)).toBe(false);
    }
  });
});

describe('isExternalUrl', () => {
  it('чужой https — внешний; сайт, якорь, относительный и mailto — нет', () => {
    expect(isExternalUrl('https://t.me/moscowcss')).toBe(true);
    for (const url of ['https://css.moscow/events/31/', '/talks/x/', '#faq', 'mailto:hi@css.moscow']) {
      expect(isExternalUrl(url), url).toBe(false);
    }
  });
});

describe('markdownSafetyPlugin', () => {
  it('внешней ссылке ставит target=_blank и rel=noopener noreferrer, своей — нет', () => {
    const { visit } = markdownSafetyPlugin.element;
    set.length = 0;
    visit({ tagName: 'a', properties: { href: '/events/31/' } }, ctx);
    expect(set).toEqual([]);
    visit({ tagName: 'a', properties: { href: 'https://t.me/moscowcss' } }, ctx);
    expect(set).toEqual([
      ['target', '_blank'],
      ['rel', 'noopener noreferrer'],
    ]);
  });

  it('сырой HTML роняет сборку с путём файла', () => {
    expect(() => markdownSafetyPlugin.raw({}, ctx)).toThrow(MarkdownSafetyError);
    expect(() => markdownSafetyPlugin.raw({}, ctx)).toThrow('/repo/packages/content/src/talks/ru/x.md');
  });

  it('ссылка и картинка с опасной схемой роняют сборку, безопасные проходят', () => {
    const { visit } = markdownSafetyPlugin.element;
    expect(() => visit({ tagName: 'a', properties: { href: 'javascript:alert(1)' } }, ctx)).toThrow('javascript:alert(1)');
    expect(() => visit({ tagName: 'img', properties: { src: 'data:image/svg+xml,x' } }, ctx)).toThrow('src');
    expect(() => visit({ tagName: 'a', properties: { href: 'https://t.me/moscowcss' } }, ctx)).not.toThrow();
  });
});

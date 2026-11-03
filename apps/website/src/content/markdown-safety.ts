import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';

// Проверка идёт по результату разбора Markdown (hast), а не по исходному тексту: у ссылки много
// записей (сноска, автоссылка, `<…>`, HTML-сущности), регулярка по тексту их пропускает, а код
// `<dialog>` в обратных кавычках, наоборот, ловит зря.

const SAFE_PROTOCOLS = new Set(['https:', 'mailto:']);
// Относительные адреса и якоря разрешаются от сайта и получают его протокол.
const BASE = 'https://css.moscow/';
const SITE_HOST = new URL(BASE).host;

/** Ссылка ведёт на другой сайт: https и чужой хост. */
export function isExternalUrl(value: string): boolean {
  try {
    const url = new URL(value, BASE);
    return url.protocol === 'https:' && url.host !== SITE_HOST;
  } catch {
    return false;
  }
}

/** Адрес безопасен в href/src: после разрешения от сайта схема https или mailto. */
export function isSafeUrl(value: string): boolean {
  try {
    return SAFE_PROTOCOLS.has(new URL(value, BASE).protocol);
  } catch {
    return false;
  }
}

const whereOf = (fileURL: URL | undefined): string =>
  fileURL ? fileURLToPath(fileURL) : 'Markdown без пути файла';

export class MarkdownSafetyError extends Error {
  constructor(fileURL: URL | undefined, problem: string) {
    super(`${whereOf(fileURL)}: ${problem}`);
    this.name = 'MarkdownSafetyError';
  }
}

// Загрузчик контента перехватывает ошибку рендера, пишет [ERROR] и оставляет запись без тела —
// сборка при этом зелёная. Поэтому нарушения копятся здесь и роняют сборку в astro:build:done.
const violations = new Set<string>();

function reject(fileURL: URL | undefined, problem: string): never {
  const error = new MarkdownSafetyError(fileURL, problem);
  violations.add(error.message);
  throw error;
}

interface VisitorContext {
  readonly fileURL: URL | undefined;
  setProperty(node: Readonly<ElementNode>, key: string, value: unknown): void;
}

interface ElementNode {
  readonly tagName: string;
  readonly properties?: Readonly<Record<string, unknown>>;
}

/** hast-плагин процессора satteri: сырой HTML и опасные ссылки роняют сборку, внешние ссылки — в новой вкладке. */
export const markdownSafetyPlugin = {
  name: 'moscowcss-markdown-safety',
  raw(_node: unknown, ctx: VisitorContext): void {
    reject(ctx.fileURL, 'в тексте HTML-разметка — пишите Markdown');
  },
  element: {
    filter: ['a', 'img'],
    visit(node: ElementNode, ctx: VisitorContext): void {
      const attribute = node.tagName === 'a' ? 'href' : 'src';
      const value = node.properties?.[attribute];
      if (typeof value !== 'string') return;
      if (!isSafeUrl(value)) {
        reject(ctx.fileURL, `адрес «${value}» в ${attribute} — разрешены только https://, mailto: и адреса сайта`);
      }
      // Внешняя ссылка открывается в новой вкладке; noopener не даёт чужой странице управлять нашей.
      if (node.tagName === 'a' && isExternalUrl(value)) {
        ctx.setProperty(node, 'target', '_blank');
        ctx.setProperty(node, 'rel', 'noopener noreferrer');
      }
    },
  },
};

interface ProcessorOptions {
  hastPlugins?: unknown[];
}

/**
 * Подключает плагин к процессору Markdown, который Astro создал по умолчанию: схема конфига
 * хранит ссылку на `processor.options`, поэтому интеграция дописывает плагин туда, а не ставит
 * вторую копию процессора другой версии.
 */
export const markdownSafety: AstroIntegration = {
  name: 'moscowcss-markdown-safety',
  hooks: {
    'astro:config:setup': ({ config }) => {
      const options = (config.markdown.processor as { options?: ProcessorOptions } | undefined)?.options;
      if (!options?.hastPlugins) {
        throw new Error('markdown-safety: процессор Markdown без hastPlugins — проверка ссылок не подключена');
      }
      options.hastPlugins.push(markdownSafetyPlugin);
    },
    'astro:build:done': () => {
      if (violations.size > 0) {
        throw new Error(`Небезопасный Markdown в контенте:\n${[...violations].map((v) => `  - ${v}`).join('\n')}`);
      }
    },
  },
};

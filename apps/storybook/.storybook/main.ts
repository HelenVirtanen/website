import { readFileSync } from 'node:fs';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import type { StorybookConfig } from '@storybook-astro/framework';

// Клиентская трансформация `.astro` во фреймворке заменяет файл заглушкой и
// сохраняет только нативные `<style>` Astro и импорты дочерних `.astro` —
// импорты `.css` / `.css.ts` (vanilla-extract) из фронтматтера отбрасываются.
// Так как каждый компонент здесь стилизован колокейт-файлом `.css.ts`, в
// renderMode 'server' эти стили не дошли бы до канваса истории. Этот плагин
// работает после маркера (enforce: 'post', добавлен последним) и заново
// подставляет отброшенные CSS-импорты как сайд-эффекты в клиентскую заглушку,
// чтобы vanilla-extract билдера внедрил стили компонентов. Только для билдера:
// внутренний SSR-сервер Astro — отдельный инстанс Vite и не получает viteFinal.
function reinjectComponentCssPlugin() {
  const cssImport = /(?:from|import)\s*\(?\s*['"]([^'"]+\.css(?:\.ts)?)['"]/g;

  return {
    name: 'storybook-astro-reinject-component-css',
    enforce: 'post' as const,
    transform(code: string, id: string) {
      if (!id.endsWith('.astro') || !code.includes('isAstroComponentFactory')) {
        return null;
      }

      let source: string;
      try {
        source = readFileSync(id, 'utf-8');
      } catch {
        return null;
      }

      const frontmatter = source.match(/^---([\s\S]*?)---/m)?.[1];
      if (frontmatter === undefined) {
        return null;
      }

      const specifiers = new Set<string>();
      for (const match of frontmatter.matchAll(cssImport)) {
        if (match[1]) {
          specifiers.add(match[1]);
        }
      }
      if (specifiers.size === 0) {
        return null;
      }

      const injected = [...specifiers].map((s) => `import ${JSON.stringify(s)};`).join('\n');
      return { code: `${injected}\n${code}`, map: null };
    },
  };
}

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  // Убираем встроенный онбординг-гайд (страница /settings/guide + чек-лист в сайдбаре).
  features: { sidebarOnboardingChecklist: false },
  framework: {
    name: '@storybook-astro/framework',
    // 'server', а не дефолтный 'static': static пререндерит истории на сборке и
    // выполняет vanilla-extract `.css.ts` без трансформации под Vite 8 /
    // Rolldown (падает). См. docs/setup-status-and-open-questions.md.
    options: { renderMode: 'server' },
  },
  async viteFinal(cfg) {
    cfg.plugins ??= [];
    cfg.plugins.push(vanillaExtractPlugin(), reinjectComponentCssPlugin());
    return cfg;
  },
};

export default config;

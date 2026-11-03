import { defineConfig } from 'astro/config';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

// Storybook в renderMode 'server' поднимает два отдельных инстанса Vite, и
// каждому нужен свой путь регистрации vanilla-extract:
//   1. builder-Vite сам подхватывает плагины из `vite.plugins` ниже;
//   2. внутренний SSR-render-сервер Astro игнорирует `vite.plugins` и берёт
//      только *интеграции* Astro, поэтому тот же плагин прокинут ещё и как
//      интеграцию. Без неё `.css.ts` там выполняется без трансформации и
//      vanilla-extract падает с "Styles were unable to be assigned to a file".
// apps/website нужен только vite-путь (у него нет SSR-render-сервера).
const vanillaExtractIntegration = {
  name: 'vanilla-extract',
  hooks: {
    'astro:config:setup': ({ updateConfig }) => {
      updateConfig({ vite: { plugins: [vanillaExtractPlugin()] } });
    },
  },
};

export default defineConfig({
  vite: {
    plugins: [vanillaExtractPlugin()],
  },
  integrations: [vanillaExtractIntegration],
});

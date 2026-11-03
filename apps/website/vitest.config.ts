/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

// getViteConfig подтягивает astro.config, поэтому тесты видят те же плагины, что и сборка.
// `astro:content` в тестах подменяется через vi.mock.
export default getViteConfig({
  test: {
    include: ['src/**/*.test.ts', 'scripts/**/*.test.mjs'],
  },
});

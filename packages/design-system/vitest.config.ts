import { defineConfig } from 'vitest/config';

// Тесты шкалы: чистые таблицы и резолвер из scale.ts, DOM не нужен.
// Стили (.css.ts) не тестируем, плагин vanilla-extract не подключаем.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});

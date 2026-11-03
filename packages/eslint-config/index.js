// Общий flat-конфиг ESLint. Каждый пакет разворачивает его в своём eslint.config.js.
// Установка зависимостей: `pnpm --filter @moscowcss/eslint-config add -D <latest>`:
//   eslint typescript-eslint eslint-plugin-astro eslint-plugin-jsx-a11y eslint-config-prettier
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ['dist/', '.astro/', '.turbo/', 'storybook-static/', 'storybook-server/', '**/generated/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  // Строгая проверка доступности разметки Astro (jsx-a11y поверх .astro-шаблонов).
  ...astro.configs['jsx-a11y-strict'],
  // Дом-стиль компонентов: `interface Props extends HTMLAttributes<'...'> {}`.
  // Пустое тело допустимо, когда компонент лишь пробрасывает нативные атрибуты;
  // правило продолжает ловить настоящие пустые `{}`.
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.astro'],
    rules: {
      '@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'with-single-extends' }],
    },
  },
  // Node-глобали для build-скриптов и конфигов (иначе URL, console, process не определены).
  {
    files: [
      '**/*.{mjs,cjs}',
      '**/*.config.{js,ts,mjs,cts,mts}',
      '**/scripts/**/*.{js,ts}',
      '**/.storybook/**/*.{js,ts}',
    ],
    languageOptions: { globals: { ...globals.node } },
  },
  prettier,
];

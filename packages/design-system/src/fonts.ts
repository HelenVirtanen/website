// Семейства и веса шрифтов — примитивы типографики (отдельно от подключения:
// @font-face и файлы живут в @moscowcss/fonts). Перечислены только реально
// подключённые веса; имена семейств обязаны совпадать с @font-face оттуда.
export const fontFamily = {
  display: '"Montserrat", system-ui, sans-serif',
  sans: '"Inter", system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
  logo: '"Jost", system-ui, sans-serif',
  text: '"Golos Text", system-ui, sans-serif',
} as const;

export const fontWeight = {
  display: {
    thin: 100,
    extraLight: 200,
    light: 300,
    regular: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
    extraBold: 800,
    black: 900,
  },
  // Inter подключён только в Medium (500).
  sans: { medium: 500 },
  mono: { light: 300, regular: 400, medium: 500, semiBold: 600, bold: 700 },
  logo: { regular: 400 },
  text: { regular: 400 },
} as const;

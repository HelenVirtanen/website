import { createGlobalTheme, globalStyle } from '@vanilla-extract/css';
import { vars } from '../contract';
import { colors } from '../colors';

// Тема отвечает ТОЛЬКО за цвет: светлая — база на :root; тёмная включается по
// системной теме и по data-theme="dark", а data-theme="light" принудительно
// возвращает светлую. Все три переопределяют только --color-*.
type ColorKey = keyof typeof vars.color;
const colorVars = (values: Record<ColorKey, string>): Record<string, string> =>
  Object.fromEntries((Object.keys(values) as ColorKey[]).map((k) => [vars.color[k], values[k]]));

createGlobalTheme(':root', vars.color, colors.light.color);
globalStyle(':root', {
  '@media': { '(prefers-color-scheme: dark)': { vars: colorVars(colors.dark.color) } },
});
globalStyle(':root[data-theme="dark"]', { vars: colorVars(colors.dark.color) });
globalStyle(':root[data-theme="light"]', { vars: colorVars(colors.light.color) });

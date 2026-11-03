import { createGlobalThemeContract } from '@vanilla-extract/css';
import { colors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';
import { border } from './border';
import { zIndex } from './zIndex';
import { layout } from './layout';

// Слой 2 — семантический контракт: форма всех токенов темы, собранная из
// отдельных групп (цвет / отступы / шрифты). Компоненты используют только `vars`.
// createGlobalThemeContract (не createThemeContract) — чтобы CSS-переменные
// получили читаемые имена: color.background -> --color-background.
export const vars = createGlobalThemeContract(
  {
    ...colors.contract,
    ...spacing.contract,
    ...typography.contract,
    ...border.contract,
    ...zIndex.contract,
    ...layout.contract,
  },
  // путь -> имя CSS-переменной (vanilla-extract добавит `--`)
  (_value, path) => path.join('-'),
);

import { createGlobalTheme, globalStyle } from '@vanilla-extract/css';
import { vars } from '../contract';
import { mediaOverrides, typeScale } from '../scale';
import { typography } from '../typography';

// Шрифты от темы не зависят — базовые (mobile-first) значения задаём один раз.
createGlobalTheme(':root', vars.font, typography.values.font);

// Адаптивная типографика: ступени кеглей берём из typeScale и меняем ТОЛЬКО
// переменные размеров. Шорткаты (vars.font.shorthand.*) ссылаются на них, поэтому
// обновляются сами.
globalStyle(':root', { '@media': mediaOverrides(vars.font.size, typeScale) });

import { globalStyle } from '@vanilla-extract/css';
import { vars } from '../contract';

// Все размеры в rem, поэтому интерфейс масштабируется кеглем корня: до 1920px он
// браузерный (100%, уважает настройку шрифта), выше растёт пропорционально ширине
// (при 1920px 100vw / 120 = 16px). Пороги @media в rem от этого не сдвигаются (ADR-002).
globalStyle('html', { fontSize: 'max(100%, 100vw / 120)' });

// Шапка липкая: без отступа якорь и элемент в фокусе оказываются под ней.
globalStyle('html', {
  scrollPaddingBlockStart: `calc(${vars.size.hitTarget} * 2)`,
});

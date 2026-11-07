import { globalStyle, style } from '@vanilla-extract/css';
import { vars, media } from '@moscowcss/design-system';

export const list = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: 0,
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const row = style({
  position: vars.position.relative,
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.layout.gap.l,
  paddingBlock: vars.layout.inset.xxl,
  borderTop: `${vars.border.width.thin} ${vars.border.style.solid} ${vars.color.divider}`,
  '@media': {
    // Не сетка: при увеличенном тексте её колонки в rem не помещаются и дают прокрутку вбок (WCAG 1.4.4), а здесь они переносятся.
    [media.laptop]: {
      flexDirection: vars.flexDirection.row,
      flexWrap: 'wrap',
      columnGap: vars.layout.gap.xxl,
      alignItems: 'flex-start',
    },
  },
});

export const portraitColumn = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.layout.gap.m,
  alignItems: vars.alignItems.center,
  width: 'fit-content',
});

export const time = style({
  margin: 0,
  font: vars.font.shorthand.programTime,
  letterSpacing: vars.font.letterSpacing.figmaWide,
  textAlign: 'center',
  textTransform: 'uppercase',
});

// Рост как у дорожки сетки: заголовок сперва занимает свой максимум, остаток достаётся описанию.
export const talkMain = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.layout.gap.m,
  minWidth: 0,
  '@media': {
    [media.laptop]: {
      flex: `1000 1 ${vars.size.programTitleColumnMin}`,
      maxWidth: vars.size.programTitleColumnMax,
    },
  },
});

export const talkTitle = style({
  margin: 0,
  font: vars.font.shorthand.programTalkTitle,
  letterSpacing: vars.font.letterSpacing.figmaWide,
  textTransform: 'uppercase',
});

// Вся строка — ссылка на доклад: псевдоэлемент ссылки растянут на строку, а заголовок остаётся её доступным именем.
export const talkLink = style({
  color: 'inherit',
  textDecoration: 'none',
  selectors: {
    '&::after': { content: '""', position: vars.position.absolute, inset: vars.inset.zero },
    '&:hover': { textDecorationLine: 'underline' },
    [`${row}:hover &`]: { textDecorationLine: 'underline' },
  },
});

export const speakerName = style({
  margin: 0,
  font: vars.font.shorthand.programSpeakerName,
  letterSpacing: vars.font.letterSpacing.figmaWide,
});

// Выше растянутой ссылки доклада: имя ведёт на спикера. Поля не двигают строку, но увеличивают зону нажатия.
export const speakerLink = style({
  position: vars.position.relative,
  zIndex: vars.zIndex.ring,
  paddingBlock: `calc((${vars.size.hitTarget} - 1lh) / 2)`,
  color: 'inherit',
});

export const speakerRole = style({
  margin: 0,
  color: vars.color.text,
  font: vars.font.shorthand.programSpeakerRole,
  letterSpacing: vars.font.letterSpacing.figmaWide,
  textTransform: 'capitalize',
});

export const description = style({
  margin: 0,
  minWidth: 0,
  font: vars.font.shorthand.programDescription,
  letterSpacing: vars.font.letterSpacing.figmaWide,
  '@media': {
    [media.laptop]: {
      flex: `1 1 ${vars.size.programDescriptionColumnMin}`,
    },
  },
});

// Ссылки в описании доклада тоже выше растянутой ссылки, иначе по ним нельзя перейти.
globalStyle(`${description} a`, {
  position: vars.position.relative,
  zIndex: vars.zIndex.ring,
});

export const activityRow = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.layout.gap.m,
  paddingBlock: vars.layout.inset.xxl,
  borderTop: `${vars.border.width.thin} ${vars.border.style.solid} ${vars.color.divider}`,
  '@media': {
    [media.laptop]: {
      display: 'grid',
      gridTemplateColumns: `${vars.size.programTimeColumn} 1fr`,
      columnGap: vars.layout.gap.xxl,
      alignItems: 'center',
    },
  },
});

export const activityTitle = style({
  margin: 0,
  font: vars.font.shorthand.programTalkTitle,
  letterSpacing: vars.font.letterSpacing.figmaWide,
  textTransform: 'uppercase',
});

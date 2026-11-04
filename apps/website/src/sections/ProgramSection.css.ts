import { style } from '@vanilla-extract/css';
import { vars, media } from '@moscowcss/design-system';
import { inner, sectionPadding } from './sectionLayout.css';

export const section = style([
  sectionPadding,
  {
    position: vars.position.relative,
    color: vars.color.text,
    background: vars.color.background,
    overflow: 'hidden',
    selectors: {
      '&::before': {
        content: '""',
        position: vars.position.absolute,
        inset: vars.inset.zero,
        opacity: 0.08,
        backgroundImage: `radial-gradient(circle at 20% 30%, ${vars.color.divider} 0, transparent 45%),
        radial-gradient(circle at 80% 70%, ${vars.color.divider} 0, transparent 40%)`,
        pointerEvents: 'none',
      },
    },
  },
]);

export { inner };

export const header = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.layout.gap.l,
  '@media': {
    [media.laptop]: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: vars.justifyContent.spaceBetween,
      gap: vars.layout.gap.xxl,
    },
  },
});

export const hint = style({
  margin: 0,
  maxWidth: vars.size.programHintMaxWidth,
  color: vars.color.text,
  font: vars.font.shorthand.programDescription,
  letterSpacing: vars.font.letterSpacing.figmaWide,
});

export const list = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: 0,
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const row = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.layout.gap.l,
  paddingBlock: vars.layout.inset.xxl,
  borderTop: `${vars.border.width.thin} ${vars.border.style.solid} ${vars.color.divider}`,
  '@media': {
    [media.laptop]: {
      display: 'grid',
      gridTemplateColumns: `${vars.size.programTimeColumn} minmax(${vars.size.programTitleColumnMin}, ${vars.size.programTitleColumnMax}) minmax(${vars.size.programDescriptionColumnMin}, 1fr)`,
      columnGap: vars.layout.gap.xxl,
      alignItems: 'start',
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

export const talkMain = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.layout.gap.m,
  minWidth: 0,
});

export const talkTitle = style({
  margin: 0,
  font: vars.font.shorthand.programTalkTitle,
  letterSpacing: vars.font.letterSpacing.figmaWide,
  textTransform: 'uppercase',
});

export const speakerName = style({
  margin: 0,
  font: vars.font.shorthand.programSpeakerName,
  letterSpacing: vars.font.letterSpacing.figmaWide,
});

export const speakerRole = style({
  margin: 0,
  color: vars.color.textMuted,
  font: vars.font.shorthand.programSpeakerRole,
  letterSpacing: vars.font.letterSpacing.figmaWide,
  textTransform: 'capitalize',
});

export const description = style({
  margin: 0,
  font: vars.font.shorthand.programDescription,
  letterSpacing: vars.font.letterSpacing.figmaWide,
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

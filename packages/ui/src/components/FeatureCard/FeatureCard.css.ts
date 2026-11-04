import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';

export const card = style({
  position: vars.position.relative,
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.layout.gap.l,
  minHeight: '28rem',
  padding: vars.layout.inset.xxl,
  paddingBottom: vars.padding['4xl'],
  overflow: 'hidden',
  color: vars.color.cardText,
  background: vars.color.cardBackground,
  // Тенью, а не рамкой: размер карточки не зависит от темы.
  boxShadow: `inset 0 0 0 ${vars.border.width.thin} ${vars.color.surfaceDarkEdge}`,
});

export const content = style({
  position: vars.position.relative,
  zIndex: 1,
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.layout.gap.l,
  flex: 1,
});

export const waveClip = style({
  position: vars.position.absolute,
  right: vars.inset.zero,
  bottom: vars.inset.zero,
  left: vars.inset.zero,
  display: vars.display.flex,
  alignItems: 'flex-end',
  pointerEvents: 'none',
});

export const waveTrack = style({
  width: '400%',
  flexShrink: 0,
});

globalStyle(`${waveTrack} svg`, {
  display: vars.display.block,
  width: '100%',
  height: 'auto',
  color: vars.color.cardMuted,
});

export const title = style({
  margin: 0,
  font: vars.font.shorthand.featureCardTitle,
  letterSpacing: vars.font.letterSpacing.figmaFeatureTitle,
  textTransform: 'uppercase',
});

export const text = style({
  margin: 0,
  font: vars.font.shorthand.featureCardBody,
  letterSpacing: vars.font.letterSpacing.figmaWide,
});

export const note = style({
  margin: 0,
  color: vars.color.cardMuted,
  font: vars.font.shorthand.featureCardFootnote,
  letterSpacing: vars.font.letterSpacing.figmaWide,
  textTransform: 'capitalize',
});

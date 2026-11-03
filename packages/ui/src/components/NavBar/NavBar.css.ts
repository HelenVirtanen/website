import { style } from '@vanilla-extract/css';
import { vars, media } from '@moscowcss/design-system';

export const root = style({
  position: vars.position.sticky,
  top: vars.inset.zero,
  zIndex: vars.zIndex.navBar,
  display: vars.display.flex,
  alignItems: vars.alignItems.center,
  justifyContent: vars.justifyContent.spaceBetween,
  gap: vars.layout.gap.m,
  boxSizing: 'border-box',
  width: '100%',
  paddingBlock: vars.padding.s,
  paddingInline: vars.layout.inset.xxl,
  background: vars.color.background,
  borderBottom: `${vars.border.width.thin} ${vars.border.style.solid} ${vars.color.divider}`,

  '@media': {
    [media.mobile]: {
      justifyContent: vars.justifyContent.spaceBetween,
      gap: 0,
      paddingBlock: vars.layout.inset.m,
      paddingInline: vars.layout.inset.l,
      borderBottom: `${vars.border.width.thin} ${vars.border.style.solid} ${vars.color.divider}`,
    },
  },
});

// Пункты строкой не помещаются уже ниже 1440px (их шесть, шрифт крупный): до `wide` — меню за кнопкой.
export const burger = style({
  display: vars.display.block,
  '@media': {
    [media.wide]: {
      display: vars.display.none,
    },
  },
});

export const home = style({
  display: vars.display.flex,
  flexShrink: 0,
  width: vars.size.navLogo,
  height: vars.size.navLogo,
  color: vars.color.focus,
  // Пока пункты спрятаны в меню, знак держится у кнопки меню, а не посередине шапки.
  marginInlineEnd: 'auto',
  selectors: {
    '&:focus-visible': {
      outline: `${vars.border.width.medium} ${vars.border.style.solid} ${vars.color.focus}`,
      outlineOffset: vars.spacing.xs,
    },
  },
  '@media': {
    [media.mobile]: {
      width: vars.size.navLogoCompact,
      height: vars.size.navLogoCompact,
      marginInlineEnd: 0,
    },
    [media.wide]: {
      marginInlineEnd: 0,
    },
  },
});

export const homeLogo = style({
  display: vars.display.block,
  width: '100%',
  height: '100%',
});

export const links = style({
  display: vars.display.none,
  alignItems: vars.alignItems.center,
  gap: vars.layout.gap.xxl,
  margin: '0 auto',
  padding: 0,
  listStyle: 'none',
  '@media': {
    [media.wide]: {
      display: vars.display.flex,
    },
  },
});

export const link = style({
  color: vars.color.text,
  font: vars.font.shorthand.subtitle,
  letterSpacing: vars.font.letterSpacing.registration,
  textDecoration: 'none',
  textTransform: 'uppercase',
  selectors: {
    '&:hover': {
      textDecoration: 'underline',
    },
    '&:focus-visible': {
      outline: `${vars.border.width.thin} ${vars.border.style.solid} ${vars.color.focus}`,
      outlineOffset: vars.spacing.xs,
    },
  },
});

export const overlay = style({
  position: vars.position.fixed,
  inset: vars.inset.zero,
  zIndex: vars.zIndex.navOverlay,
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  alignItems: vars.alignItems.stretch,
  paddingBlock: vars.padding.s,
  paddingInline: vars.padding['4xl'],
  background: vars.color.background,
  selectors: {
    '&[hidden]': {
      display: vars.display.none,
    },
  },
});

export const overlayClose = style({
  position: vars.position.absolute,
  top: vars.layout.inset.m,
  left: vars.layout.inset.l,
  boxSizing: 'border-box',
  display: vars.display.inlineFlex,
  alignItems: vars.alignItems.center,
  justifyContent: vars.justifyContent.center,
  width: vars.size.tgLinkButton,
  height: vars.size.tgLinkButton,
  padding: 0,
  border: `${vars.border.width.medium} ${vars.border.style.solid} ${vars.color.tgBorder}`,
  borderRadius: 0,
  background: vars.color.background,
  color: vars.color.tgBorder,
  cursor: 'pointer',
  selectors: {
    '&:focus-visible': {
      outline: `${vars.border.width.medium} ${vars.border.style.solid} ${vars.color.focus}`,
      outlineOffset: vars.spacing.xs,
    },
  },
  '@media': {
    [media.mobile]: {
      width: vars.size.tgLinkButtonCompact,
      height: vars.size.tgLinkButtonCompact,
    },
  },
});

export const overlayCloseIcon = style({
  width: vars.size.burgerIcon,
  height: 'auto',
  flexShrink: 0,
  '@media': {
    [media.mobile]: {
      width: vars.size.burgerIconCompact,
    },
  },
});

export const overlayLinks = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  alignItems: vars.alignItems.stretch,
  gap: vars.layout.gap.l,
  margin: 0,
  padding: 0,
  listStyle: 'none',
  '@media': {
    [media.mobile]: {
      marginTop: `calc(${vars.size.tgLinkButtonCompact} + ${vars.layout.gap.l})`,
      paddingInline: vars.padding['4xl'],
    },
  },
});

export const overlayLink = style([
  link,
  {
    display: vars.display.block,
    paddingBlock: vars.layout.inset.m,
    paddingInline: vars.padding.s,
  },
]);

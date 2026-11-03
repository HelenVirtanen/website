import { space, type SpaceStep } from './scale';

// Пространственный масштаб (t-shirt, значения в scale.ts) — один набор ступеней для двух
// семантических групп: `padding` (внутренние отступы) и `spacing` (промежутки между
// элементами, gap/margin). Ступени постоянны на всех ширинах; растущие величины — это
// `layout.inset` и `layout.gap`. Радиусы — отдельная ось.
const scaleKeys = () =>
  Object.fromEntries(Object.keys(space).map((k) => [k, null])) as Record<SpaceStep, null>;

const contract = {
  padding: scaleKeys(),
  spacing: scaleKeys(),
  radius: {
    small: null,
    medium: null,
  },
  size: {
    tgLinkButton: null,
    tgLinkButtonCompact: null,
    tgLinkButtonIcon: null,
    tgLinkButtonIconCompact: null,
    burgerIcon: null,
    burgerIconCompact: null,
    cardWidthMobile: null,
    cardWidthLaptop: null,
    cardPaddingBlock: null,
    cardPaddingInline: null,
    cardSliderArrow: null,
    speakerAvatar: null,
    speakerAvatarLaptop: null,
    programTimeColumn: null,
    programTitleColumnMin: null,
    programTitleColumnMax: null,
    programDescriptionColumnMin: null,
    heroLogoWidth: null,
    heroLogoHeight: null,
    heroCtaWidth: null,
    heroCtaHeight: null,
    partnerQrCodeWidth: null,
    partnerLogoWidth: null,
    partnerLogoHeight: null,
    partnerLogoOffsetTop: null,
    programHintMaxWidth: null,
  },
} as const;

// От темы не зависят — задаются один раз (тема отвечает только за цвет).
const values = {
  padding: { ...space },
  spacing: { ...space },
  radius: {
    small: '0.25rem', // 4px
    medium: '0.5rem', // 8px
  },
  size: {
    tgLinkButton: '3.75rem', // 60px
    tgLinkButtonCompact: '2.0625rem', // 33px
    tgLinkButtonIcon: '2.4375rem', // 39px
    tgLinkButtonIconCompact: '1.375rem', // 22px
    burgerIcon: '1.5rem', // 24px
    burgerIconCompact: '0.875rem', // 14px
    cardWidthMobile: '19.0625rem', // 305px
    cardWidthLaptop: '26.5625rem', // 425px
    cardPaddingBlock: '2.5rem', // 40px
    cardPaddingInline: '1.75rem', // 28px
    cardSliderArrow: '3.9375rem', // 63px — ширина arrow-right в навигации слайдера
    speakerAvatar: '10.5rem', // 168px
    speakerAvatarLaptop: '12.5rem', // 200px
    programTimeColumn: '12.5rem', // 200px
    programTitleColumnMin: '16rem', // 256px
    programTitleColumnMax: '26rem', // 416px
    programDescriptionColumnMin: '24rem', // 384px
    heroLogoWidth: '16.375rem',
    heroLogoHeight: '15.6875rem',
    heroCtaWidth: '32.625rem',
    heroCtaHeight: '8.8125rem',
    partnerQrCodeWidth: '12.9375rem',
    partnerLogoWidth: '51.1875rem',
    partnerLogoHeight: '14.125rem',
    partnerLogoOffsetTop: '10.146875rem',
    programHintMaxWidth: '36rem', // 576px
  },
};

export const spacing = { contract, values };

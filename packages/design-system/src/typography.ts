import { fontFamily as ff, fontWeight as fw } from './fonts';
import { baseValues, typeScale, type AdaptiveToken, type FontRole } from './scale';

// Шорткаты ссылаются на переменные размера как `var(--font-size-*)` строкой, а не
// через `vars`, — иначе была бы циклическая зависимость с contract.ts.
const size = (k: FontRole) => `var(--font-size-${k})`;
// Высота строки роли, заданная адаптивным токеном, а не числом.
const line = (k: AdaptiveToken) => `var(--adaptive-${k})`;

const roleKeys = () =>
  Object.fromEntries(Object.keys(typeScale).map((k) => [k, null])) as Record<FontRole, null>;

const contract = {
  font: {
    size: roleKeys(),
    shorthand: roleKeys(),
    letterSpacing: {
      heading: null,
      body: null,
      ui: null,
      figmaWide: null,
      figmaFeatureTitle: null,
      blockTitle: null,
      navLogo: null,
      menuLink: null,
      heroChip: null,
      heroDisplay: null,
      heroText: null,
      ctaFloating: null,
    },
  },
} as const;

const values = {
  font: {
    size: baseValues(typeScale),
    shorthand: {
      blockTitle: `${fw.display.regular} ${size('blockTitle')}/1.1 ${ff.display}`,
      websiteTitle: `${fw.display.bold} ${size('websiteTitle')}/1.05 ${ff.display}`,
      h1: `${fw.display.bold} ${size('h1')}/1.1 ${ff.display}`,
      h2: `${fw.display.semiBold} ${size('h2')}/1.2 ${ff.display}`,
      h3: `${fw.display.semiBold} ${size('h3')}/1.3 ${ff.display}`,
      h4: `${fw.display.semiBold} ${size('h4')}/1.4 ${ff.display}`,
      body: `${fw.sans.medium} ${size('body')}/1.6 ${ff.sans}`,
      subtitle: `${fw.display.regular} ${size('subtitle')} ${ff.display}`,
      caption: `${fw.sans.medium} ${size('caption')}/1.5 ${ff.sans}`,
      ui: `${fw.mono.medium} ${size('ui')}/1 ${ff.mono}`,
      programTalkTitle: `${fw.display.regular} ${size('programTalkTitle')}/2.375rem ${ff.display}`,
      programSpeakerName: `${fw.display.regular} ${size('programSpeakerName')}/2rem ${ff.display}`,
      programSpeakerRole: `${fw.display.regular} ${size('programSpeakerRole')}/1.5rem ${ff.display}`,
      programTime: `${fw.display.regular} ${size('programTime')}/2.375rem ${ff.display}`,
      programDescription: `${fw.display.regular} ${size('programDescription')}/2rem ${ff.display}`,
      featureCardTitle: `${fw.display.semiBold} ${size('featureCardTitle')}/2.5rem ${ff.display}`,
      featureCardBody: `${fw.display.regular} ${size('featureCardBody')}/2rem ${ff.display}`,
      featureCardFootnote: `${fw.display.regular} ${size('featureCardFootnote')}/1.5rem ${ff.display}`,
      partnerAddress: `${fw.display.regular} ${size('partnerAddress')}/2.75rem ${ff.display}`,
      partnerDirectionsHint: `${fw.display.regular} ${size('partnerDirectionsHint')}/2rem ${ff.display}`,
      buttonLabel: `${fw.mono.medium} ${size('buttonLabel')}/0.994 ${ff.mono}`,
      navLogo: `${fw.logo.regular} ${size('navLogo')}/1 ${ff.logo}`,
      navMono: `${fw.mono.regular} ${size('navMono')}/1.5 ${ff.mono}`,
      navMeta: `${fw.mono.light} ${size('navMeta')}/1.4 ${ff.mono}`,
      menuLink: `${fw.mono.medium} ${size('menuLink')}/1.4 ${ff.mono}`,
      heroTag: `${fw.mono.medium} ${size('heroTag')}/1 ${ff.mono}`,
      heroChip: `${fw.logo.regular} ${size('heroChip')}/1 ${ff.logo}`,
      heroDate: `${fw.mono.bold} ${size('heroDate')}/1.2 ${ff.mono}`,
      heroMeta: `${fw.mono.regular} ${size('heroMeta')}/1.5 ${ff.mono}`,
      heroDisplay: `${fw.logo.regular} ${size('heroDisplay')}/1 ${ff.logo}`,
      heroLead: `${fw.text.regular} ${size('heroLead')}/1.55 ${ff.text}`,
      heroBody: `${fw.text.regular} ${size('heroBody')}/1.55 ${ff.text}`,
      ctaFloating: `${fw.mono.bold} ${size('ctaFloating')}/1.349 ${ff.mono}`,
      cardTitle: `${fw.display.semiBold} ${size('cardTitle')}/${line('cardTitleLine')} ${ff.display}`,
      cardBody: `${fw.display.regular} ${size('cardBody')}/${line('cardBodyLine')} ${ff.display}`,
    } satisfies Record<FontRole, string>,
    letterSpacing: {
      heading: '-0.02em',
      body: '0',
      ui: '0',
      figmaWide: '0.02em',
      figmaFeatureTitle: '0.015em',
      blockTitle: '0.02em',
      navLogo: '0.02em',
      menuLink: '-0.005em',
      heroChip: '0.04em',
      heroDisplay: '-0.01em',
      heroText: '0.005em',
      ctaFloating: '0.02em',
    },
  },
};

export const typography = { contract, values };

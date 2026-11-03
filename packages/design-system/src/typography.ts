import { fontFamily as ff, fontWeight as fw } from './fonts';
import { baseValues, typeScale } from './scale';

// Шорткаты ссылаются на переменные размера как `var(--font-size-*)` строкой, а не
// через `vars`, — иначе была бы циклическая зависимость с contract.ts.
const size = (
  k:
    | 'blockTitle'
    | 'registration'
    | 'subtitle'
    | 'navLink'
    | 'websiteTitle'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'body'
    | 'caption'
    | 'ui'
    | 'programTalkTitle'
    | 'programSpeakerName'
    | 'programSpeakerRole'
    | 'programTime'
    | 'programDescription'
    | 'featureCardTitle'
    | 'featureCardBody'
    | 'featureCardFootnote'
    | 'partnerAddress'
    | 'partnerDirectionsHint'
    | 'heroTitle'
    | 'heroLightLabel'
    | 'heroMeetupLine'
    | 'heroInfoLine'
    | 'heroCtaLabel',
) => `var(--font-size-${k})`;

const contract = {
  font: {
    size: {
      blockTitle: null,
      registration: null,
      subtitle: null,
      navLink: null,
      websiteTitle: null,
      h1: null,
      h2: null,
      h3: null,
      h4: null,
      body: null,
      caption: null,
      ui: null,
      programTalkTitle: null,
      programSpeakerName: null,
      programSpeakerRole: null,
      programTime: null,
      programDescription: null,
      featureCardTitle: null,
      featureCardBody: null,
      featureCardFootnote: null,
      partnerAddress: null,
      partnerDirectionsHint: null,
      heroTitle: null,
      heroLightLabel: null,
      heroMeetupLine: null,
      heroInfoLine: null,
      heroCtaLabel: null,
    },
    shorthand: {
      blockTitle: null,
      registration: null,
      subtitle: null,
      navLink: null,
      websiteTitle: null,
      h1: null,
      h2: null,
      h3: null,
      h4: null,
      body: null,
      caption: null,
      ui: null,
      programTalkTitle: null,
      programSpeakerName: null,
      programSpeakerRole: null,
      programTime: null,
      programDescription: null,
      featureCardTitle: null,
      featureCardBody: null,
      featureCardFootnote: null,
      partnerAddress: null,
      partnerDirectionsHint: null,
      heroTitle: null,
      heroLightLabel: null,
      heroMeetupLine: null,
      heroInfoLine: null,
      heroCtaLabel: null,
    },
    letterSpacing: {
      heading: null,
      registration: null,
      body: null,
      ui: null,
      figmaWide: null,
      figmaFeatureTitle: null,
      figmaHeroTitle: null,
    },
  },
} as const;

const values = {
  font: {
    size: baseValues(typeScale),
    shorthand: {
      blockTitle: `${fw.display.regular} ${size('blockTitle')}/1.1 ${ff.display}`,
      registration: `${fw.display.bold} ${size('registration')}/1.2 ${ff.display}`,
      websiteTitle: `${fw.display.bold} ${size('websiteTitle')}/1.05 ${ff.display}`,
      h1: `${fw.display.bold} ${size('h1')}/1.1 ${ff.display}`,
      h2: `${fw.display.semiBold} ${size('h2')}/1.2 ${ff.display}`,
      h3: `${fw.display.semiBold} ${size('h3')}/1.3 ${ff.display}`,
      h4: `${fw.display.semiBold} ${size('h4')}/1.4 ${ff.display}`,
      body: `${fw.sans.medium} ${size('body')}/1.6 ${ff.sans}`,
      subtitle: `${fw.display.regular} ${size('subtitle')} ${ff.display}`,
      navLink: `${fw.display.regular} ${size('navLink')} ${ff.display}`,
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
      heroTitle: `${fw.display.regular} ${size('heroTitle')}/1.0588235294 ${ff.display}`,
      heroLightLabel: `${fw.display.light} ${size('heroLightLabel')}/1.2727272727 ${ff.display}`,
      heroMeetupLine: `${fw.display.regular} ${size('heroMeetupLine')}/2.375rem ${ff.display}`,
      heroInfoLine: `${fw.display.regular} ${size('heroInfoLine')}/1.1 ${ff.display}`,
      heroCtaLabel: `${fw.display.bold} ${size('heroCtaLabel')}/1.2083333333 ${ff.display}`,
    },
    letterSpacing: {
      heading: '-0.02em',
      registration: '0.02em',
      body: '0',
      ui: '0',
      figmaWide: '0.02em',
      figmaFeatureTitle: '0.015em',
      figmaHeroTitle: '0.03em',
    },
  },
};

export const typography = { contract, values };

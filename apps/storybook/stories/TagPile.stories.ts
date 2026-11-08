import TagPile from '@moscowcss/ui/components/TagPile';
import { setupTagPile } from '../../../packages/ui/src/components/TagPile/TagPile.client';

// Скрипт Astro-компонента в канвасе Storybook не запускается: поднимаем кучу вручную, как в preview.
const drop =
  (inlineSize: string) =>
  ({ canvasElement }: { canvasElement: HTMLElement }) => {
    canvasElement.style.inlineSize = inlineSize;
    canvasElement.querySelectorAll<HTMLElement>('[data-tag-pile]').forEach(setupTagPile);
  };

const topics = [
  'popover api',
  'state of css 2025',
  'геймификация',
  'anchor positioning',
  '#вопрос_спикеру',
  'css',
];

const many = [
  ...topics,
  'container queries',
  'view transitions',
  'scroll-driven animations',
  'subgrid',
  ':has()',
  'cascade layers',
  'color-mix()',
  'text-wrap: balance',
  '@property',
  'nesting',
  'accessibility',
  'design tokens',
  'dark mode',
  'fluid type',
  'oklch',
  'masonry',
  'field-sizing',
  'interpolate-size',
  'sibling-index()',
  'if()',
  'carousel',
  'scroll snap',
  'clip-path',
  'houdini',
  'web components',
  'performance',
  'typography',
  'grid',
  'flexbox',
  'a11y',
];

export default {
  title: 'Components/TagPile',
  component: TagPile,
  args: { label: 'Темы митапа' },
  parameters: { docs: { story: { inline: false, iframeHeight: 420 } } },
};

export const Default = {
  args: { tags: topics },
  play: drop('60rem'),
};

export const FewTags = {
  args: { tags: ['css', 'popover api'] },
  play: drop('60rem'),
};

export const ManyTags = {
  args: { tags: many },
  play: drop('60rem'),
};

export const LongTopics = {
  args: {
    tags: [
      'как мы переписали дизайн-систему на vanilla-extract и ничего не сломали',
      'state of css 2025',
      'anchor positioning для тултипов и поповеров без единой строчки javascript',
      'css',
      'геймификация',
    ],
  },
  play: drop('60rem'),
};

export const Narrow = {
  args: { tags: topics },
  play: drop('21.4375rem'),
};

// Как площадки на странице «Помочь митапу»: падает, когда попадёт на экран, медленнее и по кругу.
export const LoopOnVisible = {
  args: { tags: topics, trigger: 'visible', pace: 1.8, restMs: 3000 },
  play: drop('60rem'),
};

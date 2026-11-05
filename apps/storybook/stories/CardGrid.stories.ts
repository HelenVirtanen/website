import CardGridDemo from './CardGrid.astro';

export default {
  title: 'Components/CardGrid',
  component: CardGridDemo,
};

// Неполный последний ряд: рамка закрывается у каждой ячейки, лишних линий нет.
export const Speakers = { args: { variant: 'speakers', count: 7 } };

export const OneSpeaker = { args: { variant: 'speakers', count: 1 } };

export const Rows = { args: { variant: 'rows', count: 4 } };

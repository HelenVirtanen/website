import JoinBlock from '@moscowcss/ui/components/JoinBlock';

export default {
  title: 'Components/JoinBlock',
  component: JoinBlock,
};

const ru = {
  title: 'Хотите присоединиться?',
  speakerTitle: '/ ХОЧУ СТАТЬ СПИКЕРОМ',
  speakerIntro:
    '>Никакого предыдущего опыта публичных выступлений для выступления не требуется. Мы приветствуем всех и помогаем вам подготовиться к выступлению.',
  speakerContactPrefix: '> Напиши оргам',
  speakerContactSuffix: ', мы с тобой обсудим и подготовку, и тему доклада',
  orgTitle: '/ ХОЧУ СТАТЬ ОРГОМ',
  orgLines: [
    '>Стать оргом MoscowCSS — значит перестать ждать, когда кто-то сделал крутую тусовку, и сделать её ВМЕСТЕ С заряженными энтузиазмом единомышленниками',
    '> За идею',
    '> классных людей вокруг, формирующую среду',
    '> прокачку Софт-скиллов и респект',
    '> Бонусы? Бесплатный вход на митапы и пицца — приятно.',
    '> + Ты строишь мощный нетворк',
  ],
};

export const Default = {
  args: ru,
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const English = {
  args: {
    title: 'Want to join?',
    speakerTitle: '/ I WANT TO SPEAK',
    speakerIntro:
      '>No previous public speaking experience is required. Everyone is welcome and we help you prepare.',
    speakerContactPrefix: '> Write to the organizers',
    speakerContactSuffix: ', and we will discuss the preparation and the topic',
    orgTitle: '/ I WANT TO ORGANIZE',
    orgLines: ['>Become an organizer', '> + Build a strong network'],
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

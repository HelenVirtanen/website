import SpeakerCard from '@moscowcss/ui/components/SpeakerCard';
import photoUrl from '../../../packages/content/src/speakers/assets/aleksey-okhrimenko.jpg?url';

export default {
  title: 'Components/SpeakerCard',
  component: SpeakerCard,
};

const image = { src: photoUrl, width: 480, height: 480 };

export const Default = {
  args: { href: '#', name: 'Алексей Охрименко', image, tags: ['31', '28', '22'], tagsLabel: 'Митапы' },
};

export const WithoutTags = { args: { href: '#', name: 'Анна Иванова', image } };

export const LongName = {
  args: { href: '#', name: 'Константин Леонидович Константинопольский-Преображенский', image, tags: ['2021'], tagsLabel: 'Митапы' },
};

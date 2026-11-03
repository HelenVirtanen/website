import MediaTile from '@moscowcss/ui/components/MediaTile';

export default {
  title: 'Components/MediaTile',
  component: MediaTile,
};

export const ImagePlaceholder = {
  args: {
    kind: 'image',
    alt: 'Фото маршрута',
  },
};

export const VideoPlaceholder = {
  args: {
    kind: 'video',
    alt: 'Видео маршрута',
  },
};

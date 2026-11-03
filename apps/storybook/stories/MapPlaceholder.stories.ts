import MapPlaceholder from '@moscowcss/ui/components/MapPlaceholder';

export default {
  title: 'Components/MapPlaceholder',
  component: MapPlaceholder,
};

const labels = {
  emptyLabel: 'Карта',
  emptyHint: 'Укажите latitude и longitude',
  openLabel: 'Открыть на карте',
};

export const Empty = {
  args: { ...labels, caption: 'Карта' },
};

export const WithCoords = {
  args: {
    ...labels,
    latitude: 55.7367,
    longitude: 37.5214,
    zoom: 16,
    caption: 'Москва, ул. Поклонная, д. 3',
  },
};

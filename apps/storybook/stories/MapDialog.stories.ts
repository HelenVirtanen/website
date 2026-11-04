import MapDialog from '@moscowcss/ui/components/MapDialog';

export default {
  title: 'Components/MapDialog',
  component: MapDialog,
};

export const Default = {
  args: {
    latitude: 55.7367,
    longitude: 37.5214,
    zoom: 16,
    address: 'Москва, Поклонная, д. 3',
    openLabel: 'Показать на карте',
    closeLabel: 'Закрыть карту',
    providersLabel: 'Открыть в сервисе:',
    providers: { yandex: 'Яндекс Карты', twoGis: '2ГИС', google: 'Google Карты' },
  },
};

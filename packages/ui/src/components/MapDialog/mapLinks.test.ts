import { describe, expect, it } from 'vitest';
import { mapLinks } from './mapLinks';

const links = mapLinks({ latitude: 55.7367, longitude: 37.5214, zoom: 16 });

describe('mapLinks', () => {
  it('Яндекс получает сначала долготу, а метка стоит в той же точке', () => {
    expect(links.yandex).toBe('https://yandex.ru/maps/?ll=37.5214%2C55.7367&z=16&pt=37.5214,55.7367,pm2rdm');
  });

  it('встраиваемая карта показывает ту же точку', () => {
    expect(links.embed).toBe('https://yandex.ru/map-widget/v1/?ll=37.5214%2C55.7367&z=16&pt=37.5214,55.7367,pm2rdm');
  });

  it('2ГИС получает сначала долготу и масштаб', () => {
    expect(links.twoGis).toBe('https://2gis.ru/geo/37.5214,55.7367?m=37.5214,55.7367/16');
  });

  it('Google получает сначала широту', () => {
    expect(links.google).toBe('https://www.google.com/maps/search/?api=1&query=55.7367,37.5214');
  });

  it('все адреса https', () => {
    for (const url of Object.values(links)) expect(url.startsWith('https://')).toBe(true);
  });
});

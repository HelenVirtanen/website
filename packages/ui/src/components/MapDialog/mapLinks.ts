export interface MapPoint {
  latitude: number;
  longitude: number;
  zoom: number;
}

export interface MapLinks {
  /** Карта для встраивания: 2ГИС встраивание запрещает, а Google без ключа работает ненадёжно */
  embed: string;
  yandex: string;
  twoGis: string;
  google: string;
}

/** Адреса точки в картах. Порядок координат у сервисов разный: Яндекс и 2ГИС ждут сначала долготу. */
export function mapLinks({ latitude, longitude, zoom }: MapPoint): MapLinks {
  const lonLat = `${String(longitude)},${String(latitude)}`;
  const yandexQuery = `ll=${String(longitude)}%2C${String(latitude)}&z=${String(zoom)}&pt=${lonLat},pm2rdm`;
  return {
    embed: `https://yandex.ru/map-widget/v1/?${yandexQuery}`,
    yandex: `https://yandex.ru/maps/?${yandexQuery}`,
    twoGis: `https://2gis.ru/geo/${lonLat}?m=${lonLat}/${String(zoom)}`,
    google: `https://www.google.com/maps/search/?api=1&query=${String(latitude)},${String(longitude)}`,
  };
}

// Пропорции из макета (1280px artboard) — безразмерные, поэтому не CSS-переменные; размеры живут в vars.size.
export const dimensions = {
  mapFrame: {
    aspectRatio: '1280 / 583',
  },
  mediaTile: {
    aspectRatio: '413.3333435058594 / 309.1412658691406',
  },
} as const;

import qrcode from 'qrcode-generator';

export interface QrPath {
  /** Сторона матрицы в модулях: viewBox `0 0 size size` */
  size: number;
  /** SVG-путь тёмных модулей: по прямоугольнику на модуль */
  d: string;
}

/**
 * QR-код адреса как SVG-путь: рисуется на сборке, без картинки в репозитории. Уровень коррекции
 * M (15 %) — запас на печать и камеру телефона без лишней плотности. Поля нет: его даёт вёрстка.
 */
export function qrPath(text: string): QrPath {
  // typeNumber 0 — минимальная версия, в которую влезает текст.
  const qr = qrcode(0, 'M');
  qr.addData(text);
  qr.make();
  const size = qr.getModuleCount();
  const parts: string[] = [];
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (qr.isDark(row, col)) parts.push(`M${String(col)} ${String(row)}h1v1h-1z`);
    }
  }
  return { size, d: parts.join('') };
}

// Конфиг SVGO для иконок. По умолчанию иконки монохромные и красятся через
// `color`: convertColors приводит любые цвета к `currentColor`, removeDimensions
// срезает width/height (размером управляет компонент). removeViewBox не трогаем —
// SVGO 4 сохраняет его сам.
// removeUselessStrokeAndFill выключен: иначе он срезает fill="none", который нужен
// обводочным (stroke) иконкам — без него открытый контур зальётся цветом родителя.
// Для многоцветных иконок убери convertColors.currentColor.
export default {
  multipass: true,
  plugins: [
    { name: 'preset-default', params: { overrides: { removeUselessStrokeAndFill: false } } },
    'removeDimensions',
    { name: 'convertColors', params: { currentColor: true } },
  ],
};

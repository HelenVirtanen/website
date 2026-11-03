import Prose from '@moscowcss/ui/components/Prose';

export default {
  title: 'Components/Prose',
  component: Prose,
};

export const Default = {
  args: {
    slots: {
      default: `<p>Первый абзац с <a href="https://t.me/moscowcss">ссылкой</a> и <strong>выделением</strong>.</p>
<p>Второй абзац.<br>Перенос строки внутри абзаца.</p>
<ul><li>Первый пункт</li><li>Второй пункт</li></ul>
<ol><li>Шаг один</li><li>Шаг два</li></ol>`,
    },
  },
};

export const Empty = {
  args: {
    slots: { default: '' },
  },
};

export const LongContent = {
  args: {
    slots: {
      default: `<p>Очень длинная ссылка без пробелов: <a href="https://example.com/a-very-long-path/that-keeps-going/and-going/and-going/and-going/and-going/and-going">https://example.com/a-very-long-path/that-keeps-going/and-going/and-going/and-going/and-going/and-going</a></p>
<p>Длинное слово без переносов: Donaudampfschifffahrtsgesellschaftskapitänsmützenabzeichenhersteller. Остальной текст абзаца тянется достаточно долго, чтобы занять несколько строк и показать межстрочный интервал и поведение переноса на узкой ширине.</p>
<ul><li>Пункт 1</li><li>Пункт 2</li><li>Пункт 3</li><li>Пункт 4</li><li>Пункт 5</li><li>Пункт 6</li></ul>`,
    },
  },
};

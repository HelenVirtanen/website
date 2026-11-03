// Митап проходит в Москве: дата и время показываются по московскому времени на любом языке.
const EVENT_TIME_ZONE = 'Europe/Moscow';

export interface EventDateParts {
  /** День и месяц словами на языке страницы: «9 июля» */
  day: string;
  /** Год числом: «2026» */
  year: string;
  /** Время `ЧЧ:ММ` в сутках 0–23 */
  time: string;
}

export function eventDateParts(date: Date, locale: string): EventDateParts {
  if (Number.isNaN(date.getTime())) throw new RangeError('Некорректная дата митапа');
  return {
    day: new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long',
      timeZone: EVENT_TIME_ZONE,
    }).format(date),
    year: new Intl.DateTimeFormat(locale, { year: 'numeric', timeZone: EVENT_TIME_ZONE }).format(
      date,
    ),
    // en-GB с h23 даёт `18:00` без AM/PM и без «24:00» в полночь, язык страницы здесь не важен.
    time: new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
      timeZone: EVENT_TIME_ZONE,
    }).format(date),
  };
}

/** Подставляет `{имя}` из шаблона словаря; неизвестное имя — ошибка, а не молчаливая дыра в тексте. */
export function fillTemplate(template: string, values: Readonly<Record<string, string>>): string {
  return template.replace(/\{(\w+)\}/g, (_match, name: string) => {
    const value = values[name];
    if (value === undefined) throw new Error(`В шаблоне «${template}» нет значения для {${name}}`);
    return value;
  });
}

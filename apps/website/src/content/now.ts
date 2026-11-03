// BUILD_NOW — только для визуальных снимков: фиксирует «сейчас», чтобы страницы не зависели от часов.
export function buildNow(env: Record<string, string | undefined> = process.env): Date {
  const value = env['BUILD_NOW'];
  const now = value === undefined || value === '' ? new Date() : new Date(value);
  if (Number.isNaN(now.getTime())) {
    throw new Error(`BUILD_NOW="${value ?? ''}": expected an ISO date, e.g. 2026-07-01`);
  }
  return now;
}

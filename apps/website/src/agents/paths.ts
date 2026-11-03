/** Адрес Markdown-версии страницы: `index.md` в папке страницы (`/events/31/index.md`). */
export const markdownPathOf = (path: string): string => `${path.endsWith('/') ? path : `${path}/`}index.md`;

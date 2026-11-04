import { chromium } from 'playwright-core';

// playwright-core сам браузер не скачивает. Каналы Playwright находят установленный Chrome и Edge
// на Windows, macOS и Linux; на Linux без них остаётся системный Chromium.
const CANDIDATES = [{ channel: 'chrome' }, { channel: 'msedge' }, { executablePath: '/usr/bin/chromium' }];

/** Запускает браузер: `CHROMIUM_PATH`, если он задан, иначе первый найденный в системе. */
export async function launchBrowser(options = {}) {
  const explicit = process.env.CHROMIUM_PATH;
  const candidates = explicit ? [{ executablePath: explicit }] : CANDIDATES;
  const errors = [];
  for (const candidate of candidates) {
    try {
      return await chromium.launch({ ...options, ...candidate });
    } catch (error) {
      errors.push(`${candidate.channel ?? candidate.executablePath}: ${error.message.split('\n')[0]}`);
    }
  }
  throw new Error(`не найден браузер, укажите его в CHROMIUM_PATH (${errors.join('; ')})`);
}

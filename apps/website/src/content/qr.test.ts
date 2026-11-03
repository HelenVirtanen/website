import { describe, expect, it } from 'vitest';
import { qrPath } from './qr';

describe('qrPath', () => {
  it('квадратная матрица версии 1+ и путь из модулей', () => {
    const { size, d } = qrPath('https://t.me/zvuk_jobs');
    expect(size).toBeGreaterThanOrEqual(21);
    expect((size - 17) % 4).toBe(0);
    expect(d).toMatch(/^(M\d+ \d+h1v1h-1z)+$/);
  });

  it('разные адреса — разные коды, один адрес — один код', () => {
    expect(qrPath('https://t.me/a').d).not.toBe(qrPath('https://t.me/b').d);
    expect(qrPath('https://t.me/a')).toEqual(qrPath('https://t.me/a'));
  });
});

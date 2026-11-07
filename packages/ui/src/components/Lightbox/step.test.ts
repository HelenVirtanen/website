import { describe, expect, it } from 'vitest';
import { stepIndex } from './step';

describe('stepIndex', () => {
  it('листает вперёд и назад по кругу', () => {
    expect(stepIndex(0, 1, 3)).toBe(1);
    expect(stepIndex(2, 1, 3)).toBe(0);
    expect(stepIndex(0, -1, 3)).toBe(2);
  });

  it('с одним фото и без фото остаётся на месте', () => {
    expect(stepIndex(0, 1, 1)).toBe(0);
    expect(stepIndex(0, -1, 0)).toBe(0);
  });
});

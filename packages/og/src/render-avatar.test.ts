import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { AVATAR_SIZE, initialsOf, renderAvatar } from './render-avatar';

describe('initialsOf', () => {
  it('первые буквы двух слов, заглавные, кириллица и латиница', () => {
    expect(initialsOf('Дарья Егорова')).toBe('ДЕ');
    expect(initialsOf('denis makushin')).toBe('DM');
    expect(initialsOf('  Анна   Мария Расторгуева ')).toBe('АМ');
  });

  it('одно слово — одна буква, пустое имя — «?»', () => {
    expect(initialsOf('Cher')).toBe('C');
    expect(initialsOf('   ')).toBe('?');
  });
});

describe('renderAvatar', () => {
  it(`PNG ${String(AVATAR_SIZE)}×${String(AVATAR_SIZE)}, разные имена — разные картинки`, async () => {
    const a = await renderAvatar({ name: 'Дарья Егорова' });
    const b = await renderAvatar({ name: 'Denis Makushin' });
    const info = await sharp(a).metadata();
    expect(info.format).toBe('png');
    expect([info.width, info.height]).toEqual([AVATAR_SIZE, AVATAR_SIZE]);
    expect(a.equals(b)).toBe(false);
  });
});

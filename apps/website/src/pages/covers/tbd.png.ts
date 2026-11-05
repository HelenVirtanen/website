import type { APIRoute } from 'astro';
import { renderCard } from '@moscowcss/og';
import { CARD_TYPE } from '../../seo/og';

// Заглушка обложки доклада, у которого ещё нет карточки анонса. Слово TBD одинаково на обоих
// языках, поэтому картинка одна.
export const GET: APIRoute = async () => {
  const png = await renderCard({ title: 'TBD', kicker: '', meta: '', size: 'og' });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': CARD_TYPE } });
};

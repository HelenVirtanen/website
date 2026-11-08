import type { APIRoute } from 'astro';
import { feedResponse, feedStaticPaths } from '../../../rss/endpoint';

// Лента только митапов языка: анонсы и прошедшие встречи.
export const getStaticPaths = feedStaticPaths;

export const GET: APIRoute = (context) => feedResponse('events', context);

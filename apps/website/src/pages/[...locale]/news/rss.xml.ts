import type { APIRoute } from 'astro';
import { feedResponse, feedStaticPaths } from '../../../rss/endpoint';

// Лента только новостей языка.
export const getStaticPaths = feedStaticPaths;

export const GET: APIRoute = (context) => feedResponse('news', context);

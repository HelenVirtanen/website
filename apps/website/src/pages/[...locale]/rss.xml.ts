import type { APIRoute } from 'astro';
import { feedResponse, feedStaticPaths } from '../../rss/endpoint';

// Общая лента языка: митапы и новости вместе, свежие сверху.
export const getStaticPaths = feedStaticPaths;

export const GET: APIRoute = (context) => feedResponse('all', context);

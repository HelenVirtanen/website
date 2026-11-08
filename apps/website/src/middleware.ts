import { defineMiddleware } from 'astro:middleware';

// Картинки сборки (`/og/…png`, `/covers/…png`, `/avatars/…png`) — эндпоинты с расширением в параметре. При
// trailingSlash: 'always' dev-сервер находит их только со слэшем на конце, а в разметке адрес без слэша. На
// сборке это файлы в dist, поэтому подмена нужна только в dev.
const BUILD_IMAGE = /^\/(?:og|covers|avatars)\/.+\.png$/;

export const onRequest = defineMiddleware((context, next) => {
  if (import.meta.env.DEV && BUILD_IMAGE.test(context.url.pathname)) {
    return next(`${context.url.pathname}/`);
  }
  return next();
});

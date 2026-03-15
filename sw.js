const CACHE = 'wizpos-v2';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// GET 요청만 캐싱, POST/PUT/DELETE는 무조건 네트워크
self.addEventListener('fetch', e => {
  // API 요청은 캐싱 절대 안 함
  if (e.request.url.includes('pos-api.wizclass.net')) return;
  // POST 등 변경 요청은 캐싱 안 함
  if (e.request.method !== 'GET') return;
  // sw.js 자체는 캐싱 안 함
  if (e.request.url.includes('sw.js')) return;

  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});

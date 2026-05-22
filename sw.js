/* Service worker — Ombeline ♥
   Cache-first pour les assets, network-first pour le document HTML. */

const VERSION = 'ombeline-v3';
const CORE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './manifest.json',
  './src/utils.jsx',
  './src/App.jsx',
  './src/screens/Intro.jsx',
  './src/screens/Chapter1.jsx',
  './src/screens/Chapter2.jsx',
  './src/screens/Chapter3.jsx',
  './src/screens/Gift.jsx',
  './src/screens/Games.jsx',
  './src/games/CatchNon.jsx',
  './src/games/Memory.jsx',
  './src/games/CatchCactus.jsx',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(CORE_ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // HTML : network-first (pour récupérer les mises à jour de l'histoire)
  if (req.mode === 'navigate' || (req.destination === '' && url.pathname.endsWith('.html'))) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
    );
    return;
  }

  // Assets : cache-first
  event.respondWith(
    caches.match(req).then((cached) =>
      cached ||
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put(req, copy));
        return res;
      }).catch(() => cached)
    )
  );
});

// 오프라인 담당. 처음 열 때 파일을 모두 받아 두고, 그 뒤로는 받아 둔 파일로 연다.
// index.html이나 다른 파일을 고치면 VERSION을 올린다. 그래야 휴대폰이 새 파일을 받는다.
const VERSION = 'sfx-bench-3';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(VERSION)
      .then((c) => c.addAll(FILES.map((f) => new Request(f, {cache: 'reload'}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, {ignoreSearch: true}).then((hit) => hit || fetch(e.request))
  );
});

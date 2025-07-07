const CACHE_NAME = 'turist-rehberi-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // Diğer statik dosyalar buraya eklenebilir
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      );
    })
  );
});

// Dinamik cache: API ve sayfa isteklerini cache'le
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;
      return fetch(event.request).then((res) => {
        // Sadece http(s) istekleri cache'lenir
        if (!event.request.url.startsWith('http')) return res;
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, res.clone());
          return res;
        });
      }).catch(() => caches.match('/offline.html'));
    })
  );
});

// Push notification örneği
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Turist Rehberi';
  const options = {
    body: data.body || 'Yeni bir bildiriminiz var!',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Background sync örneği
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-favorites') {
    // Burada offline favori işlemlerini sunucuya gönderebilirsiniz
    // (Backend entegrasyonu gerektirir)
    event.waitUntil(Promise.resolve());
  }
}); 
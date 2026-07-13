var CACHE = 'aiktk-v1';
var FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(FILES.map(function(f) {
        return new Request(f, {credentials: 'same-origin'});
      }));
    })
  );
});

self.addEventListener('fetch', function(e) {
  // For API calls, go to network
  if (e.request.url.includes('api.deepseek.com') || e.request.url.includes('api.github.com')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(function(r) {
      return r || fetch(e.request).then(function(resp) {
        if (resp.ok) {
          var clone = resp.clone();
          caches.open(CACHE).then(function(c) {c.put(e.request, clone)});
        }
        return resp;
      });
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k) {return k !== CACHE}).map(function(k) {return caches.delete(k)}));
    })
  );
});

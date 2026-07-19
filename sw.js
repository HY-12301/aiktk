// 题库版本号：更新题库文件后须同步 bump 此处与 index.html 中的 BANK_VER
var BANK_VER = '5';
// 缓存桶名绑定 BANK_VER：bump 后 activate 会清掉旧桶(含旧 gz)，避免 cache-first 命中旧题库
var CACHE = 'aiktk-' + BANK_VER;
// 保留题库解析缓存(ai-questions)，避免每次重新解析 40MB
var KEEP = [CACHE, 'ai-questions-'+BANK_VER];
var FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', function(e) {
  self.skipWaiting(); // 新 SW 安装后立即激活，不等旧页面关闭
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(FILES.map(function(f) {
        return new Request(f, {credentials: 'same-origin'});
      }));
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    self.clients.claim().then(function() {
      return caches.keys().then(function(keys) {
        return Promise.all(keys.filter(function(k) {
          return KEEP.indexOf(k) === -1;
        }).map(function(k) { return caches.delete(k); }));
      });
    })
  );
});

self.addEventListener('fetch', function(e) {
  var url = e.request.url;
  // API 调用直接走网络
  if (url.indexOf('api.deepseek.com') !== -1 || url.indexOf('api.github.com') !== -1) return;

  // 页面(navigate 或 index.html) 用 network-first：保证每次拿到最新页面
  if (e.request.mode === 'navigate' || url.indexOf('index.html') !== -1) {
    e.respondWith(
      fetch(e.request).then(function(resp) {
        if (resp && resp.ok) {
          var clone = resp.clone();
          caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
        }
        return resp;
      }).catch(function() {
        return caches.match(e.request);
      })
    );
    return;
  }

  // 其余资源(题库 gz 等) cache-first：避免重复下载
  e.respondWith(
    caches.match(e.request).then(function(r) {
      return r || fetch(e.request).then(function(resp) {
        if (resp.ok) {
          var clone = resp.clone();
          caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
        }
        return resp;
      });
    })
  );
});

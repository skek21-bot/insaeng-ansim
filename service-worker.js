const CACHE_NAME = 'insaeng-ansim-v3';

self.addEventListener('install', function(e){
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(self.clients.claim());
});

// 네트워크를 우선 쓰고, 실패하면(오프라인 등) 캐시된 이전 응답을 돌려줌
self.addEventListener('fetch', function(e){
  if(e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(function(res){
        if(res && res.status === 200){
          var resClone = res.clone();
          caches.open(CACHE_NAME).then(function(cache){ cache.put(e.request, resClone); });
        }
        return res;
      })
      .catch(function(){ return caches.match(e.request); })
  );
});

const CACHE_NAME = "solpon-v17";

const urlsToCache = [
  "./",
  "./index.html",
  "./pedometer.html",
  "./stamps.html",
  "./stampWelcome.png",
  "./silent.mp3"
];

/* インストール */

self.addEventListener("install", e => {

  self.skipWaiting();

  e.waitUntil(

    caches.open(CACHE_NAME)
    .then(cache => {
      return cache.addAll(urlsToCache);
    })

  );

});

/* 有効化 */

self.addEventListener("activate", e => {

  e.waitUntil(

    caches.keys().then(keys => {

      return Promise.all(

        keys.map(key => {

          if(key !== CACHE_NAME){

            return caches.delete(key);

          }

        })

      );

    })

  );

  self.clients.claim();

});

/* 通信 */

self.addEventListener("fetch", e => {

  e.respondWith(

    fetch(e.request)
    .then(response => {

      const responseClone =
      response.clone();

      caches.open(CACHE_NAME)
      .then(cache => {

        cache.put(
          e.request,
          responseClone
        );

      });

      return response;

    })
    .catch(() => {

      return caches.match(e.request);

    })

  );

});

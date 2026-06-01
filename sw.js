const CACHE_NAME = "solpon-v16";

const urlsToCache = [
  "./",
  "./index.html",
  "./pedometer.html",
  "./stamps.html"
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

    caches.match(e.request)
    .then(cached => {

      /* あった */

      if(cached){

        return cached;

      }

      /* なかった */

      return fetch(e.request)
      .then(response => {

        /*
          画像なら自動保存
        */

        if(
          e.request.url.match(
            /\.(png|jpg|jpeg|webp|gif)$/i
          )
        ){

          const responseClone =
          response.clone();

          caches.open(CACHE_NAME)
          .then(cache => {

            cache.put(
              e.request,
              responseClone
            );

          });

        }

        return response;

      });

    })

  );

});

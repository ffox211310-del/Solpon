const CACHE_NAME = "solpon-v1";

const urlsToCache = [
  "./",
  "./index.html",
  "./pedometer.html"
];

self.addEventListener("install", e => {

  e.waitUntil(

    caches.open(CACHE_NAME)
    .then(cache => {
      return cache.addAll(urlsToCache);
    })

  );

});

self.addEventListener("fetch", e => {

  e.respondWith(

    caches.match(e.request)
    .then(response => {
      return response || fetch(e.request);
    })

  );

});

const cacheName = "DefaultCompany-DessertPuzzle-1.0";
const contentToCache = [
    "Build/newout.loader.js",
    "Build/newout.framework.js",
    "Build/newout.data",
    "Build/newout.wasm",
    "TemplateData/style.css"

];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});

self.addEventListener('fetch', function (e) {
    e.respondWith((async function () {
      let response = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (response) { return response; }

      response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);

      console.log("e.request: " + JSON.stringify(e.request));
      console.log("response.clone(): " + JSON.stringify(response.clone()));

      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);

      cache.put(e.request, response.clone());
      return response;
    })());
});

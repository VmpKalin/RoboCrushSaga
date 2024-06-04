const cacheName = "RoboComp-RoboTom-1.0";
const contentToCache = [
    "Build/Roboton.loader.js",
    "Build/Roboton.framework.js",
    "Build/Roboton.data",
    "Build/Roboton.wasm",
    "TemplateData/style.css"

];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
    e.waitUntil((async function () {
        try
        {
            const cache = await caches.open(cacheName);
            console.log('[Service Worker] Caching all: app shell and content');
            await cache.addAll(contentToCache);
        } catch(e)
        {
            console.error('install: Failed to cache request:', e);
        }
    })());
});

self.addEventListener('fetch', function (e) {
    e.respondWith((async function () {
    try {
        let response = await caches.match(e.request);
        console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
        if (response) { return response; }
  
        response = await fetch(e.request);
        if (e.request.method == 'POST') {
          console.error("Skip unsupported method")
          return response;
        }
  
        const cache = await caches.open(cacheName);
        console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
        cache.put(e.request, response.clone());
        return response; 
    } catch (e) {
        console.error('fetch: Failed to cache request:', e);
        return null
    }
    })());
});

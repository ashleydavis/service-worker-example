
console.log(`Hello from the service worker!`);

//
// On install, precache the resources for this web page.
//
self.addEventListener("install", event => {

    console.log(`Precaching resources for the web page.`);

    event.waitUntil(addResourcesToCache([
        "/",
        "/index.js",
    ]));
});

//
// On fetch, return the cached resources.
//
self.addEventListener("fetch", event => {

    event.respondWith(cacheFirst(event.request));
});

//
// Fetch using a cache-first strategy.
//
async function cacheFirst(request) {
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
        //
        // Request is satsified from the cache.
        //
        console.log(`>> HTTP ${request.method} ${request.url} from cache.`);
        return responseFromCache;
    }

    //
    // Request is not in the cache. Fetch it from the network.
    //
    console.log(`>> HTTP ${request.method} ${request.url} from network.`);
    return fetch(request);
};

//
// Caches a list of resources.
//
async function addResourcesToCache(resources) {
    const cache = await caches.open("v1");
    await cache.addAll(resources);
};


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
// Puts a response in the cache.
//
async function cacheResponse(request, response) {
    const cache = await caches.open("v1");
    await cache.put(request, response);

    console.error(`Cached response for HTTP ${request.method} ${request.url}`);
};

//
// Fetch using a cache-first strategy.
//
async function cacheFirst(request) {
    try {
        const responseFromCache = await caches.match(request);
        if (responseFromCache) {
            //
            // Request is satsified from the cache.
            //
            console.log(`Requuest satisfied from cache: HTTP ${request.method} ${request.url}`);
            return responseFromCache;
        }
    
        //
        // Request is not in the cache. Fetch it from the network.
        //
        console.log(`>> HTTP ${request.method} ${request.url} from network.`);
        const responseFromNetwork = await fetch(request);

        if (request.scheme === "http" || request.scheme === "https") {    
            //
            // Cache the response.
            //
            // Cloning the response is necessary because request and response streams can only be read once.
            //
            cacheResponse(request, responseFromNetwork.clone())
                .catch(err => {
                    console.error(`Failed to cache response for HTTP ${request.method} ${request.url}`);
                    console.error(err);
                });
        }

        return responseFromNetwork;
    }
    catch (err) {
        //
        // There is nothing in the cache and a network error happened.
        //
        const message = `An error happened while fetching HTTP ${request.method} ${request.url}]\r\n${err}`;
        return new Response(message, {
            status: 408,
            headers: { "Content-Type": "text/plain" },
        });
    }
};

//
// Caches a list of resources.
//
async function addResourcesToCache(resources) {
    const cache = await caches.open("v1");
    await cache.addAll(resources);
};

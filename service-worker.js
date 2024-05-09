
console.log(`Hello from the service worker!`);

const CACHE_NAME = "app-v1";

//
// Pre-caches the resources for this web page.
//
function preCache() {
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
}

//
// Pre-cache the resources for this web page.
//
// preCache();

//
// On fetch, return the cached resources.
//
self.addEventListener("fetch", event => {

    console.log(`Service worker ${CACHE_NAME}`);
    console.log(`@@@@ Fetch for ${event.request.method} ${event.request.url}`);
    console.log(event.request);
    // console.log(`Request headers:`);
    // for (const [key, value] of event.request.headers.entries()) {
    //     console.log(`${key}: ${value}`);
    // }

    // event.respondWith(cacheFirst(event.request));

    event.respondWith(networkFirst(event.request));
});

//
// Puts a response in the cache.
//
async function cacheResponse(request, response) {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response);

    // console.log(`!! Response to ${request.url}:`); 
    // console.log(response);
    // console.log(`== ${response.headers.get("Content-Type")}`);

    // console.log("Response headers:");
    // for (const [key, value] of response.headers.entries()) {
    //     console.log(`${key}: ${value}`);
    // }

    console.log(`✔ Cached response for HTTP ${request.method} ${request.url}`);
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
// The types of assets that can be cached.
//
const cachableContentTypes = [
    "text/html",
    "text/css",
    "application/javascript",
];

//
// Checks if the content type is cacheable.
//
function isCacheable(contentType) {
    for (const cachableContentType of cachableContentTypes) {
        if (contentType.includes(cachableContentType)) {
            console.log(`## Cacheable content type: ${contentType}`);
            return true;
        }
    }

    console.log(`## Not cacheable content type: ${contentType}`);
    return false;
}

//
// Fetch using a network-first strategy.
//
async function networkFirst(request) {
    try {
        //
        // Fetch the resource from the network.
        //
        console.log(`>> HTTP ${request.method} ${request.url} from network.`);
        const responseFromNetwork = await fetch(request);

        console.log(`<< Response to ${request.url}:`); 
        console.log(responseFromNetwork);
        console.log(`== ${responseFromNetwork.headers.get("Content-Type")}`);

        // console.log("Response headers:");
        // for (const [key, value] of responseFromNetwork.headers.entries()) {
        //     console.log(`${key}: ${value}`);
        // }

        if (request.url.startsWith("http://") || request.url.startsWith("https://")) {
            const contentType = responseFromNetwork.headers.get("Content-Type");
            if (contentType && isCacheable(contentType)) {
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
            else {
                console.log(`!! Not caching request with response type ${contentType}`);
            }
        }

        return responseFromNetwork;
    }
    catch (err) {
        console.error(`Failed to fetch Request ${request.method} ${request.url} from network.`);
        console.error(err);

        //
        // Fetching the resource from the network failed. Try to get it from the cache.
        //
        console.log(`>> Request ${request.method} ${request.url} from cache.`);
        const responseFromCache = await caches.match(request);
        if (responseFromCache) {
            //
            // Request is satsified from the cache.
            //
            console.log(`Requuest satisfied from cache: Request ${request.method} ${request.url}`);
            return responseFromCache;
        }

        //
        // There is nothing in the cache and a network error happened.
        //
        const message = `An error happened while fetching Request ${request.method} ${request.url}]\r\n${err}`;
        return new Response(message, {
            status: 408,
            headers: { "Content-Type": "text/plain" },
        });        
    }
}

//
// Caches a list of resources.
//
async function addResourcesToCache(resources) {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(resources);
};

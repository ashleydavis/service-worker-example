# service-worker-example

The simplest example of using a service worker in a static web page.

## Pre reqs

You need Node.js and `live-server` installed to serve the web page:

```bash
npm install -g live-server
```

## Try it out

```bash
git clone https://github.com/ashleydavis/service-worker-example.git
cd service-worker-example
live-server
```

Open a your browser and navigate to http://127.0.0.1:8080/.

Open dev tools to see console logging.

Enable "Update on reload" in the "Application -> Service workers" section of dev tools. This makes the service work update when you reload the web page.

You might have to hold down on the refresh button in the browser and choose "Empty Cache and Hard Reload" to actually make the page and the service worker reload.

## Resources

- https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
- https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#the_premise_of_service_workers
- https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent/respondWith
- https://css-tricks.com/add-a-service-worker-to-your-site/
- https://www.chromium.org/blink/serviceworker/service-worker-faq/
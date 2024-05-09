
if (navigator && navigator.serviceWorker) {
    navigator.serviceWorker.register('service-worker.js')
        .then(registration => {
            console.log(`Service Worker registered! Scope: ${registration.scope}`);
            console.log(registration);
        })
        .catch(err => {
            console.error(`Failed to register the service worker:`);
            console.error(err);
        });
}

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

document.addEventListener('DOMContentLoaded', () => {
    console.log(`Fetching data...`);
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(data => {
            console.log(`Retreived JSON data:`);
            console.log(data);
        })
        .catch(err => {
            console.error(`Failed to fetch JSON data:`);
            console.error(err);
        });
});
const CACHE_NAME = 'bookloks-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/data/manifest.json',
    '/data/New folder/background music.mp3',
    '/data/New folder/4 or 5 right question applause music after succesful mission.mp3',
    '/data/New folder/1.2.3 question better luck next time music after failed mission.mp3'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) return response;
                return fetch(event.request);
            })
    );
});

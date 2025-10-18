// Service Worker - Offline oyun desteği için
const CACHE_NAME = 'mystic-valley-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/js/game.js',
    '/js/player.js',
    '/js/world.js',
    '/js/inventory.js',
    '/js/magic.js',
    '/js/farming.js',
    '/js/ui.js',
    '/js/audio.js',
    '/js/main.js'
];

// Service Worker kurulumu
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Cache açıldı');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch olayları - offline destek
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Cache'de varsa döndür
                if (response) {
                    return response;
                }
                
                // Yoksa network'ten al
                return fetch(event.request);
            }
        )
    );
});

// Cache güncelleme
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Eski cache siliniyor:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
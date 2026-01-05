const CACHE = 'pdf2pptx-v1';
const ASSETS = [
    '.',
    'index.html',
    'manifest.json',
    'icon-192.png',
    'icon-512.png'
];

// External resources to cache
const EXTERNAL_ASSETS = [
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
    'https://cdn.jsdelivr.net/gh/gitbrent/PptxGenJS@3.12.0/dist/pptxgen.bundle.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE).then(cache => {
            // Cache local assets
            cache.addAll(ASSETS);
            // Try to cache external assets (may fail due to CORS)
            EXTERNAL_ASSETS.forEach(url => {
                fetch(url, { mode: 'cors' })
                    .then(response => {
                        if (response.ok) {
                            cache.put(url, response);
                        }
                    })
                    .catch(() => {});
            });
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE).map(key => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cached => {
            // Return cached version or fetch from network
            return cached || fetch(event.request).then(response => {
                // Cache successful responses
                if (response.ok && event.request.method === 'GET') {
                    const clone = response.clone();
                    caches.open(CACHE).then(cache => {
                        cache.put(event.request, clone);
                    });
                }
                return response;
            });
        }).catch(() => {
            // Offline fallback for navigation requests
            if (event.request.mode === 'navigate') {
                return caches.match('index.html');
            }
        })
    );
});

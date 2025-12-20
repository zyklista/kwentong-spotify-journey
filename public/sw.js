const CACHE_NAME = 'diary-of-ofw-v2';
const STATIC_CACHE = 'diary-of-ofw-static-v2';
const DYNAMIC_CACHE = 'diary-of-ofw-dynamic-v2';

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/site.webmanifest',
  '/robots.txt',
  '/sitemap.xml',
  '/ebook.png',
  '/services.png',
  '/lovable-uploads/0965794f-f490-4dee-8031-bbad64aaa5a1.png'
  // Cache critical CSS and JS will be added by Vite
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  // Force activation of new service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all clients
  self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external requests (except images from trusted sources)
  if (!url.origin.includes(self.location.origin) &&
      !url.origin.includes('fonts.googleapis.com') &&
      !url.origin.includes('fonts.gstatic.com') &&
      !url.origin.includes('img.youtube.com')) {
    return;
  }

  // Handle different resource types
  if (request.destination === 'image') {
    // Cache-first strategy for images
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request).then((response) => {
          // Cache successful responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      })
    );
  } else if (request.destination === 'font') {
    // Cache-first strategy for fonts
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request).then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      })
    );
  } else {
    // Network-first strategy for HTML and API calls
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.ok && request.destination !== 'document') {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request);
        })
    );
  }
});
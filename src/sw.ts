import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';

declare let self: ServiceWorkerGlobalScope;

// Precache static resources
precacheAndRoute(self.__WB_MANIFEST);

// Cache OpenWeather API responses
registerRoute(
  ({ url }) => url.href.includes('api.openweathermap.org'),
  new NetworkFirst({
    cacheName: 'weather-api-cache',
    networkTimeoutSeconds: 3,
  })
);

// Cache weather icons
registerRoute(
  ({ url }) => url.href.includes('openweathermap.org/img'),
  new CacheFirst({
    cacheName: 'weather-images-cache',
  })
);

// Cache other static assets
registerRoute(
  ({ request }) => request.destination === 'image' ||
                   request.destination === 'style' ||
                   request.destination === 'script' ||
                   request.destination === 'font',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
);

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.0.0-alpha.24/workbox-sw.js');

// Google analytics
workbox.googleAnalytics.initialize()

// Placeholder array which is populated automatically by workboxBuild.injectManifest()
workbox.precaching.precacheAndRoute([]);

// Use a cache first strategy for files from firebasestorage.googleapis.com
workbox.routing.registerRoute(
  new RegExp('https://firebasestorage.googleapis.com'),
  workboxSW.strategies.cacheFirst({
    cacheName: 'firebasestorage',
    cacheExpiration: {
      // Expire after 30 days (expressed in seconds)
      maxAgeSeconds: 30 * 24 * 60 * 60,
    },
  })
);

// Use a cache first strategy for files from googleapis.com
workbox.routing.registerRoute(
  new RegExp('https://fonts.googleapis.com'),
  workboxSW.strategies.cacheFirst({
    cacheName: 'googlefonts',
    cacheExpiration: {
      // Expire after 30 days (expressed in seconds)
      maxAgeSeconds: 30 * 24 * 60 * 60,
    },
  })
);

// Note to self, woff regexp will also match woff2 :P
workbox.routing.registerRoute(
  new RegExp('.(?:ttf|otf|woff)$'),
  workboxSW.strategies.cacheFirst({
    cacheName: 'fonts',
    cacheExpiration: {
      // Expire after 24 hours (expressed in seconds)
      maxAgeSeconds: 1 * 24 * 60 * 60,
    },
  })
);

workbox.routing.registerRoute(
  new RegExp('.(css)$'),
  workboxSW.strategies.networkFirst({
    cacheName: 'css',
    cacheExpiration: {
      maxAgeSeconds: 1 * 24 * 60 * 60,
    },
  })
);

// Use a cache-first strategy for the images
workbox.routing.registerRoute(
  new RegExp('.(?:png|gif|jpg|svg)$'),
  workboxSW.strategies.cacheFirst({
    cacheName: 'images',
    cacheExpiration: {
      // maximum 50 entries
      maxEntries: 50,
      // Expire after 30 days (expressed in seconds)
      maxAgeSeconds: 30 * 24 * 60 * 60,
    },
    // The images are returned as opaque responses, with a status of 0.
    // Normally these wouldn't be cached; here we opt-in to caching them.
    // If the image returns a satus 200 we cache it too
    cacheableResponse: {statuses: [0, 200]},
  })
);

// Match all .htm and .html files use cacheFirst
workbox.routing.registerRoute(
  new RegExp('(.htm)$'),
  workboxSW.strategies.cacheFirst({
    cacheName: 'content',
    cacheExpiration: {
      maxAgeSeconds: 1 * 24 * 60 * 60,
    },
  })
);

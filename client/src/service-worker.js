// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
// importScripts('https://www.gstatic.com/firebasejs/4.10.1/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/4.10.1/firebase-messaging.js');
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.0.0/workbox-sw.js');

// Create Workbox service worker instance
// const workboxSW = new WorkboxSW({ 
//   clientsClaim: true,
//   skipWaiting: true
// });
workbox.skipWaiting();
workbox.clientsClaim();

// Google analytics for workbox v3
// workbox.googleAnalytics.initialize()

// Placeholder array which is populated automatically by workboxBuild.injectManifest()
workbox.precaching.precache([]);

workbox.routing.registerNavigationRoute('index.html');

// Use a cache first strategy for files from firebasestorage.googleapis.com
workbox.routing.registerRoute(
  /^https:\/\/firebasestorage\.googleapis\.com\//,
  workbox.strategies.cacheFirst({
    cacheName: 'firebasestorage',
    cacheExpiration: {
      // Expire after 30 days (expressed in seconds)
      maxAgeSeconds: 30 * 24 * 60 * 60,
    },
  })
);

// Use a cache first strategy for files from googleapis.com
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com\//,
  workbox.strategies.cacheFirst({
    cacheName: 'googlefonts',
    cacheExpiration: {
      // Expire after 30 days (expressed in seconds)
      maxAgeSeconds: 30 * 24 * 60 * 60,
    },
  })
);

// Note to self, woff regexp will also match woff2 :P
workbox.routing.registerRoute(
  new RegExp('.(?:ttf|otf|eot|svg|woff)$'),
  workbox.strategies.cacheFirst({
    cacheName: 'fonts',
    cacheExpiration: {
      // Expire after 24 hours (expressed in seconds)
      maxAgeSeconds: 1 * 24 * 60 * 60,
    },
  })
);

workbox.routing.registerRoute(
  new RegExp('.(css)$'),
  workbox.strategies.networkFirst({
    cacheName: 'css',
    cacheExpiration: {
      maxAgeSeconds: 1 * 24 * 60 * 60,
    },
  })
);

// Use a cache-first strategy for the images
workbox.routing.registerRoute(
  new RegExp('.(?:png|gif|jpg|svg)$'),
  workbox.strategies.cacheFirst({
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
  workbox.strategies.cacheFirst({
    cacheName: 'content',
    cacheExpiration: {
      maxAgeSeconds: 1 * 24 * 60 * 60,
    },
  })
);

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
// firebase.initializeApp({
//   'messagingSenderId': '741733387760'
// });

// // Retrieve an instance of Firebase Messaging so that it can handle background
// // messages.
// const messaging = firebase.messaging();

// messaging.setBackgroundMessageHandler(function(payload) {
//   console.log(payload);
//   // Customize notification here
//   const title = 'Garnett';
//   const options = {
//     body: 'Background Message body.',
//     icon: '/images/garnett.png',
//     click_action: 'https://garnett-app.herokuapp.com'
//   };

//   return self.registration.showNotification(title, options);
// });

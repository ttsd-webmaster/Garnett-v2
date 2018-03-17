// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/4.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.10.1/firebase-messaging.js');
importScripts('workbox-sw.prod.js');

// Create Workbox service worker instance
// const workboxSW = new WorkboxSW({ 
//   clientsClaim: true,
//   skipWaiting: true
// });
workbox.skipWaiting();
workbox.clientsClaim();

// Google analytics for workbox v3
workbox.googleAnalytics.initialize()

// Placeholder array which is populated automatically by workboxBuild.injectManifest()
workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

workbox.routing.registerNavigationRoute('/index.html');

// Use a cache first strategy for files from firebasestorage.googleapis.com
workbox.routing.registerRoute(
  /^https:\/\/firebasestorage\.googleapis\.com\//,
  workbox.strategies.cacheFirst({
    cacheName: 'firebasestorage',
    plugins: [
      new workbox.expiration.Plugin({
        // Expire after 30 days (expressed in seconds)
        maxAgeSeconds: 30 * 24 * 60 * 60,
      })
    ]
  })
);

// Use a cache first strategy for files from googleapis.com
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com\//,
  workbox.strategies.cacheFirst({
    cacheName: 'googlefonts',
    plugins: [
      new workbox.expiration.Plugin({
        // Expire after 30 days (expressed in seconds)
        maxAgeSeconds: 30 * 24 * 60 * 60,
      })
    ]
  })
);

// Note to self, woff regexp will also match woff2 :P
workbox.routing.registerRoute(
  new RegExp('.(?:ttf|otf|eot|woff)$'),
  workbox.strategies.cacheFirst({
    cacheName: 'fonts',
    plugins: [
      new workbox.expiration.Plugin({
        // Expire after 24 hours (expressed in seconds)
        maxAgeSeconds: 1 * 24 * 60 * 60,
      })
    ]
  })
);

workbox.routing.registerRoute(
  new RegExp('.(css)$'),
  workbox.strategies.networkFirst({
    cacheName: 'css',
    plugins: [
      new workbox.expiration.Plugin({
        // Expire after 24 hours (expressed in seconds)
        maxAgeSeconds: 1 * 24 * 60 * 60,
      })
    ]
  })
);

// Use a cache-first strategy for the images
workbox.routing.registerRoute(
  new RegExp('.(?:png|gif|jpg|svg)$'),
  workbox.strategies.cacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        // maximum 50 entries
        maxEntries: 50,
        // Expire after 30 days (expressed in seconds)
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
      new workbox.cacheableResponse.Plugin({
        // The images are returned as opaque responses, with a status of 0.
        // Normally these wouldn't be cached; here we opt-in to caching them.
        // If the image returns a status 200 we cache it too
        statuses: [0, 200]
      })
    ]
  })
);

// Match all .htm and .html files use cacheFirst
workbox.routing.registerRoute(
  new RegExp('(.htm)$'),
  workbox.strategies.cacheFirst({
    cacheName: 'content',
    plugins: [
      new workbox.expiration.Plugin({
        // Expire after 24 hours (expressed in seconds)
        maxAgeSeconds: 1 * 24 * 60 * 60,
      })
    ]
  })
);

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  'messagingSenderId': '741733387760'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log(payload);
  // Customize notification here
  const title = 'Garnett';
  const options = {
    body: 'Background Message body.',
    icon: '/images/garnett.png',
    click_action: 'https://garnett-app.herokuapp.com'
  };

  return self.registration.showNotification(title, options);
});

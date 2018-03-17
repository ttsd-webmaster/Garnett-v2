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

// Placeholder array which is populated automatically by workboxBuild.injectManifest()
workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

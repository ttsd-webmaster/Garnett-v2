importScripts('/node_modules/workbox-sw/build/importScripts/workbox-sw.prod.v2.1.2.js');

// Create Workbox service worker instance
const workboxSW = new WorkboxSW({ 
  clientsClaim: true,
  skipWaiting: true
});

// Placeholder array which is populated automatically by workboxBuild.injectManifest()
workboxSW.precache([]);
// uncoment for debugging
// workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug);

workbox.routing.registerRoute(
  new RegExp('https://avatars.slack-edge.com/*'),
  new workbox.strategies.StaleWhileRevalidate(),
);

// right now these are precached so this route makes no difference.
// keeping it for future use
workbox.routing.registerRoute(
  new RegExp('/static/(css|js|media)/'),
  new workbox.strategies.CacheFirst(),
);

workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

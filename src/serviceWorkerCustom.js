// uncoment for debugging
// workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug);

const cachedResponseWillBeUsed = ({ cache, request, cachedResponse }) => {
  // If there's already a match against the request URL, return it.
  if (cachedResponse) {
    return cachedResponse;
  }

  // Otherwise, return a match for a specific URL:
  const urlToMatch = 'index.html';
  return caches.match(urlToMatch);
};

// cache URL parameters such as ?moduslabsci
const indexCachingStrategy = workbox.strategies.networkFirst({
  cacheName: 'modir-index',
  cacheExpiration: {
    maxEntries: 5,
  },
  cacheableResponse: { statuses: [0, 200] },
  plugins: [{ cachedResponseWillBeUsed }],
});

workbox.routing.registerRoute(/\.(?:html|png)$/, indexCachingStrategy);

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

workbox.precaching.precacheAndRoute(self.__precacheManifest || [], {
  offlinePage: '/index.html', //<- in case of getting offline and not have cache content , redirect here
});

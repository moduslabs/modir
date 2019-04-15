/* global workbox */
// uncoment for debugging
// workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug);

const cachedResponseWillBeUsed = ({ cachedResponse }) => {
  // If there's already a match against the request URL, return it.
  if (cachedResponse) {
    return cachedResponse
  }

  // Otherwise, return a match for a specific URL:
  const urlToMatch = 'index.html'
  return caches.match(urlToMatch)
}

// cache URL parameters such as ?moduslabsci
const indexCachingStrategy = workbox.strategies.networkFirst({
  cacheName: 'modir-index',
  cacheExpiration: {
    maxEntries: 5,
  },
  cacheableResponse: {
    statuses: [0, 200],
  },
  plugins: [
    {
      cachedResponseWillBeUsed,
    },
  ],
})

workbox.routing.registerRoute(/\.(?:html|png)$/, indexCachingStrategy)

workbox.routing.registerRoute(
  new RegExp('https://avatars.slack-edge.com/*'),
  new workbox.strategies.StaleWhileRevalidate(),
)

// right now these are precached so this route makes no difference.
// keeping it for future use
workbox.routing.registerRoute(new RegExp('/static/(css|js|media)/'), new workbox.strategies.CacheFirst())

workbox.precaching.precacheAndRoute(self.__precacheManifest || [], {
  offlinePage: '/index.html', //<- in case of getting offline and not have cache content , redirect here
})

workbox.routing.setCatchHandler(({ event }) => {
  // The FALLBACK_URL entries must be added to the cache ahead of time, either via runtime
  // or precaching.
  // If they are precached, then call workbox.precaching.getCacheKeyForURL(FALLBACK_URL)
  // to get the correct cache key to pass in to caches.match().
  //
  // Use event, request, and url to figure out how to respond.
  // One approach would be to use request.destination, see
  // https://medium.com/dev-channel/service-worker-caching-strategies-based-on-request-types-57411dd7652c
  switch (event.request.destination) {
    case 'document':
      return caches.match('/index.html')

    default:
      // If we don't have a fallback, just return an error response.
      return Response.error()
  }
})

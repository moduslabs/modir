workbox.routing.registerRoute(
  new RegExp('https://avatars.slack-edge.com/*'),
  workbox.strategies.StaleWhileRevalidate()
)
workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

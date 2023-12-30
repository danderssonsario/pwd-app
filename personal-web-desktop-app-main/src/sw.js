const version = '1.0.0'
const shellAssets = [
  '/',
  'index.html',
  '/js/index.js',
  '/css/styles.css',
  '/img/pwd-images/background.png',
  '/img/pwd-images/chat-icon.png',
  '/img/pwd-images/memory-icon.png',
  '/img/pwd-images/r&m-icon.png',
  '/img/memory-app-images/check.png',
  '/img/memory-app-images/facebook.png',
  '/img/memory-app-images/instagram.png',
  '/img/memory-app-images/linkedin.png',
  '/img/memory-app-images/reddit.png',
  '/img/memory-app-images/slack.png',
  '/img/memory-app-images/snapchat.png',
  '/img/memory-app-images/twitter.png',
  '/img/memory-app-images/youtube.png'
]
const dynamicCaches = 'dynamic-1.0.0'

self.addEventListener('install', (event) => {
  /**
   * Cache shell assets when install event is fired.
   *
   * @returns {Promise} Promise that resolves with undefined.
   */
  const cacheAssets = async () => {
    const caches = await self.caches.open(version)
    console.log('Caching files.')
    return caches.addAll(shellAssets)
  }
  event.waitUntil(cacheAssets())
})

self.addEventListener('activate', (event) => {
  /**
   * Keeps track of cache versions, removes old when a new one is set.
   *
   * @returns {Promise} The cache key matching the current one.
   */
  const removeOldCache = async () => {
    const cacheKeys = await caches.keys()

    return Promise.all(
      cacheKeys
        .filter((key) => key !== version)
        .map((key) => caches.delete(key))
    )
  }
  console.log('Clearing Cache.')
  event.waitUntil(removeOldCache())
})

self.addEventListener('fetch', (event) => {
  console.log('fetch')

  /**
   * Caches a fetched resource, or serves cached asset if request fails.
   *
   * @returns {any} Promise from fetch or the cached asset.
   */
  const cacheFetch = async () => {
    try {
      const response = await fetch(event.request)

      const cache = await caches.open(dynamicCaches)
      cache.put(event.request, response.clone())

      return response
    } catch (e) {
      console.log('Serving cached results.')
      return await caches.match(event.request)
    }
  }

  event.respondWith(cacheFetch(event.request))
})

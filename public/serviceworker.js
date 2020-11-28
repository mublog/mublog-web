const cacheName = "µblog"
const filesToCache = [
  "/",
  "/index.html",
  "/app.js",
  "/styles/main.css",
  "/styles/battlenet.woff2",
  "/styles/svg/arrow-min.svg",
  "/styles/svg/box.svg",
  "/styles/svg/button-active.svg",
  "/styles/svg/button-invalid.svg",
  "/styles/svg/button-normal.svg",
  "/styles/svg/circle-transparent.svg",
  "/styles/svg/favicon.svg",
  "/styles/svg/icons.svg",
  "/styles/svg/input.svg",
  "/styles/svg/loading.svg",
  "/styles/svg/loading-circle.svg",
  "/styles/svg/seperator.svg"
]

addEventListener("install", event => {
  console.log("[ServiceWorker] Install")
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log("[ServiceWorker] Caching app shell")
      return cache.addAll(filesToCache)
    })
  )
})

addEventListener("activate", event => {
  caches.keys().then(keyList => {
    return Promise.all(
      keyList.map(key => {
        if (key !== cacheName) {
          console.log("[ServiceWorker] - Removing old cache", key)
          return caches.delete(key)
        }
      })
    )
  })
})

addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(response => {
      return response || fetch(event.request)
    })
  )
})
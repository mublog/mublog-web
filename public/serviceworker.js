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
  console.info("[ServiceWorker] Install")
  event.waitUntil(
    caches.open(cacheName)
      .then(c => c.addAll(filesToCache))
      .then(() => console.info("[ServiceWorker] Cache"))
      .catch(e => console.error("[ServiceWorker] Cache/Error", e))
  )
})

addEventListener("activate", event => {
  caches.keys()
    .then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== cacheName) {
            return caches.delete(key)
          }
        })
      )
    })
    .catch(e => console.error("[ServiceWorker] Cache/Error", e))
})

addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true })
      .then(r => r || fetch(event.request))
      .catch(e => console.error("[ServiceWorker] Fetch/Error", e))
  )
})
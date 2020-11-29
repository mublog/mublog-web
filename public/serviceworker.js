const cacheName = "µblog"
const filesToCache = [
  "/",
  "/index.html",
  "/app.js",
  "/styles/main.css",
  "/styles/battlenet.woff2",
  "/assets/assets-2x.png",
  "/assets/icon-180.png",
  "/assets/icon-196.png",
  "/assets/maskable-196.png",
  "/assets/mu-logo.png",
  "/assets/mu-logo.svg.png",
  "/assets/splash.png",
  "/assets/sprite-green-button-1.png",
  "/assets/sprite-green-button-2.png",
  "/assets/sprite-input-1.png",
  "/assets/sprite-loading-bar.png",
  "/assets/sprite-seperator.png",
  "/assets/sprite-white-box.png"
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
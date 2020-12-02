import { useState } from "../../modules/doc/mod"

export default ServiceWorkerService()

function ServiceWorkerService() {
  const isInstalled = useState(false)
  const isNotInstalled = useState(true)

  const pub = { isInstalled, isNotInstalled, install, uninstall }

  async function install() {
    if ("serviceWorker" in navigator) {
      await navigator.serviceWorker.register("serviceworker.js")
      console.log("[ServiceWorker] - Registered")
      isInstalled.set(true)
      isNotInstalled.set(false)
    }
    return pub
  }

  async function uninstall() {
    if ("serviceWorker" in navigator) {
      let registrations = await navigator.serviceWorker.getRegistrations()
      for (let registration of registrations) {
        if (registration) registration.unregister()
      }
    }
    isInstalled.set(false)
    isNotInstalled.set(true)
    return pub
  }

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistration("serviceworker.js")
      .then(registration => {
        if (registration && registration.active) {
          isInstalled.set(!!registration.active)
          isNotInstalled.set(!registration.active)
        }
        else {
          isInstalled.set(false)
          isNotInstalled.set(true)
        }
      })
      .catch(() => {
        isInstalled.set(false)
        isNotInstalled.set(true)
      })
  }

  return pub
}
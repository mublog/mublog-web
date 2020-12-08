import { useState } from "../../mod/doc/mod"

export const isInstalled = useState(false)
export const isNotInstalled = useState(true)

isInstalled.subscribe(state => isNotInstalled.set(!state))

export async function install() {
  if ("serviceWorker" in navigator) {
    await navigator.serviceWorker.register("serviceworker.js")
    isInstalled.set(true)
  }
}

export async function uninstall() {
  if ("serviceWorker" in navigator) {
    let registrations = await navigator.serviceWorker.getRegistrations()
    for (let registration of registrations) {
      if (registration) registration.unregister()
    }
  }
  isInstalled.set(false)
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistration("serviceworker.js")
    .then(registration => {
      if (registration && registration.active) {
        isInstalled.set(!!registration.active)
      }
      else {
        isInstalled.set(false)
      }
    })
    .catch(() => isInstalled.set(false))
}
import Doc from "./modules/doc/mod"
import "./app/directives/mu.directive"
import * as service from "./app/services/generic.service"
import Router from "./app/components/router.component"
import Navigation from "./app/components/navigation.component"
import UserCardPortal from "./app/components/user-card.component"
import Routes from "./routes"

/* if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("serviceworker.js").then(() => {
    console.log("[ServiceWorker] - Registered")
  })
} */

function Application(): HTMLDivElement {
  return (
    <div id="app">
      <div id="loading-bar" if={service.isLoading} />
      <div id="app-grid">
        <aside id="side">
          <Navigation />
        </aside>
        <main id="content">
          <Router routes={Routes} />
        </main>
      </div>
      <div styles={{ height: "100vh", width: "100vw", position: "fixed", top: "0", left: "0", pointerEvents: "none" }}>
        <div portal={UserCardPortal} />
      </div>
    </div>
  )
}

document.getElementById("app").replaceWith(<Application />)
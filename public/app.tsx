import Doc from "./mod/doc/mod"
import "./app/directives/mu.directive"
import * as service from "./app/services/generic.service"
import Router from "./app/components/router.component"
import Navigation from "./app/components/navigation.component"
import UserCardPortal from "./app/components/user-card.component"
import Routes from "./routes"

function Application() {
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
  ) as HTMLDivElement
}

document.getElementById("app").replaceWith(<Application />)
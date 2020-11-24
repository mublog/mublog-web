import { createElement, mount } from "./modules/doc/mod"
import "./app/services/notification.service"
import * as generic from "./app/services/generic.service"
import Router from "./app/components/router.component"
import Navigation from "./app/components/navigation.component"
import Header from "./app/components/header.component"
import Routes from "./routes"

function Application(): HTMLDivElement {
  return (
    <div id="app">
      <div id="loading-bar" if={generic.isLoading} />
      <Header />
      <div id="app-grid">
        <Navigation />
        <div id="content">
          <Router routes={Routes} />
        </div>
      </div>
    </div>
  )
}

mount(<Application />, document.getElementById("app"))
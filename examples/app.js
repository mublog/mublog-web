// @ts-check
import Choc from "../module.js"
import Router from "./app/components/router.js"
import Navigation from "./app/components/navigation.js"

const App = Choc.create("div", { id: "app" },
    Navigation,
    Choc.create("div", { id: "content" },
        Router
    )
)

App.mount(document.getElementById("app"))
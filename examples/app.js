// @ts-check
import Choc from "../module.js"
import Router from "./app/components/router.js"
import Navigation from "./app/components/navigation.js"
import Notification from "./app/components/notifications.js"

const App = Choc.create("div", { id: "app" },
    Navigation,
    Choc.create("div", { id: "content" }, Router)
)

Notification.appendTo(document.body)
App.mount(document.getElementById("app"))
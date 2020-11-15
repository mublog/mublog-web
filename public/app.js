// @ts-check
import Doc, { mount } from "../modules/doc/module.js"
import Router from "./app/components/router.js"
import Header from "./app/components/header.js"
import Navigation from "./app/components/navigation.js"
import Notifications from "./app/components/notifications.js"

const App = Doc.createNode("div", { id: "app" },
    Header,
    Notifications,
    Doc.createNode("div", { id: "app-grid" },
        Navigation,
        Doc.createNode("div", { id: "content" }, Router)
    )
)

mount(document.getElementById("app"), App)
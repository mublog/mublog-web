import Doc, { mount } from "../modules/doc/module"
import Router from "./app/components/router"
import Header from "./app/components/header"
import Navigation from "./app/components/navigation"
import Notifications from "./app/components/notifications"

const App = Doc.createElement("div", { id: "app" },
    Header,
    Notifications,
    Doc.createElement("div", { id: "app-grid" },
        Navigation,
        Doc.createElement("div", { id: "content" }, Router)
    )
)

mount(document.getElementById("app"), App)
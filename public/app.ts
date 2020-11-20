import Doc, { mount } from "./modules/doc/module"
import Router from "./app/components/router.component"
import Header from "./app/components/header.component"
import Navigation from "./app/components/navigation.component"
import Notifications from "./app/components/notification.component"

const App = Doc.createElement("div", { id: "app" },
    Header,
    Notifications,
    Doc.createElement("div", { id: "app-grid" },
        Navigation,
        Doc.createElement("div", { id: "content" }, Router)
    )
)

mount(document.getElementById("app"), App)
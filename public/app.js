// @ts-check
import Doc, { mount } from "../modules/doc/module.js"
import Router from "./app/components/router.js"
import Navigation from "./app/components/navigation.js"

const App = Doc.createNode("div", { id: "app" },
    Navigation,
    Doc.createNode("div", { id: "content" }, Router)
)

mount(document.getElementById("app"), App)
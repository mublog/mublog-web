// @ts-check
import i18n from "../lang/de_DE.js"

import { Div, A, Route, activateRoute } from "./generic.js"
import { isComment, loadingCircle } from "./decorators.js"
import Box, { Seperator, Title } from "./box.js"
import Notifications from "../components/notifications.js"

import { UserService } from "../services/db.js"

const Navigation = (function() {
    let items = async () => {
        let isAuthorized = await UserService.isAuthorized()
        return [
            Route({ href: "/" }, i18n.home),
            isComment(Route({ href: "/login" }, i18n.login)).if(isAuthorized),
            isComment(Route({ href: "/register" }, i18n.register)).if(isAuthorized),
            isComment(A(null, i18n.logout).addEvent("click", logout)).if(!isAuthorized)
        ]
    }

    let component = Box({ id: "navigation" },
        Title({ }, i18n.navigation),
        Seperator(),
        loadingCircle(Div({ key: "list", className: "list" }))
    )

    component.child("list").addSignal("load", async node => {
        node.signal("while", async () => {
            let newList = await items()
            node.nativeElement.innerHTML = ""
            node.append(...newList)
        })
    })
    component.addSignal("refresh", node => node.child("list").signal("load"))
    component.signal("refresh")
    
    return component
})()

export default Navigation

async function logout() {
    await UserService.logout()
    activateRoute("/login")
    Navigation.signal("refresh")
    Notifications.push(null, i18n.logoutMessage)
}
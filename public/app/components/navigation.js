// @ts-check
import i18n from "../../lang/de_DE.js"

import Doc, { useEvent, selectAll, useStyles } from "../../../modules/doc/module.js"
import { Route, activateRoute } from "./generic.js"
import Box, { Header } from "./box.js"
import Notifications from "../components/notifications.js"
import { User } from "../services/fakedb.js"

const Navigation = (function() {
    const ViewActionLogout = Doc.createNode("a", { className: "only-user action-logout" }, i18n.logout)
    const View = Box({ id: "navigation" },
        Header({}, i18n.navigation),
        Doc.createNode("div", { className: "list" },
            Route({ href: "/" }, i18n.home),
            Route({ href: "/login", className: "not-user" }, i18n.login),
            Route({ href: "/register", className: "not-user" }, i18n.register),
            ViewActionLogout
        )
    )

    const UserNav = selectAll(View, ".only-user", "i")
    const GuestNav = selectAll(View, ".not-user", "i")

    User.subscribe(state => {
        UserNav.forEach(nav => useStyles(nav, { display: state.loggedIn === false ? "none !important" : "" }))
        GuestNav.forEach(nav => useStyles(nav, { display: state.loggedIn === true ? "none !important" : "" }))
    })

    useEvent(ViewActionLogout, "click", logout)

    return View
})()

export default Navigation

async function logout() {
    activateRoute("/login")
    User.update(state => state.loggedIn = false)
    Notifications.push(null, i18n.logoutMessage)
}
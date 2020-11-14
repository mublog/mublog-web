// @ts-check
import i18n from "../../lang/de_DE.js"

import Doc, { useEvent, useStyles } from "../../../modules/doc/module.js"
import { activateRoute } from "./generic.js"
import Box, { Header } from "./box.js"
import Notifications from "../components/notifications.js"
import { User } from "../services/fakedb.js"

const Navigation = (function() {
    const View = Box({ id: "navigation" },
        Header({}, i18n.navigation),
        Doc.createNode("div", { className: "list" },
            Doc.createNode("a", { href: "/" }, i18n.home),
            Doc.createNode("a", { href: "/login", className: "for-guest" }, i18n.login),
            Doc.createNode("a", { href: "/register", className: "for-guest" }, i18n.register),
            Doc.createNode("a", { className: "for-user action-logout" }, i18n.logout)
        )
    )

    //const ViewListRef = Doc.query(View, "div", ".list")
    const UserNavRef = Doc.queryAll(View, "a", ".for-user")
    const GuestNavRef = Doc.queryAll(View, "a", ".for-guest")

    User.subscribe(state => {
        UserNavRef.forEach(nav => useStyles(nav, { display: state.loggedIn === false ? "none !important" : "" }))
        GuestNavRef.forEach(nav => useStyles(nav, { display: state.loggedIn === true ? "none !important" : "" }))
    })

    useEvent(Doc.query(View, "a", ".action-logout"), "click", logout)

    return View
})()

export default Navigation

async function logout() {
    User.update(state => state.loggedIn = false)
    activateRoute("/login")
    Notifications.push(null, i18n.logoutMessage)
}
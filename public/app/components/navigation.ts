import i18n from "../../lang/de_DE.json"
import Doc, { useEvent, useStyles } from "../../../modules/doc/module"
import { activateRoute } from "./generic"
import Box, { Header } from "./box"
import Notifications from "./notifications"
import { User as UserService } from "../services/user"

const Navigation = (function() {
    const View = Box({ id: "navigation" },
        Header({}, i18n.navigation),
        Doc.createNode("div", { className: "list" },
            Doc.createNode("a", { href: "/" }, i18n.home),
            Doc.createNode("a", { href: "/presentation" }, i18n.presentation),
            Doc.createNode("a", { href: "/login", className: "for-guest" }, i18n.login),
            Doc.createNode("a", { href: "/register", className: "for-guest" }, i18n.register),
            Doc.createNode("a", { className: "for-user action-logout" }, i18n.logout)
        )
    )

    const UserNavRef = Doc.queryAll<HTMLAnchorElement>(View, ".for-user")
    const GuestNavRef = Doc.queryAll<HTMLAnchorElement>(View, ".for-guest")
    const LogoutRef = Doc.query<HTMLAnchorElement>(View, ".action-logout")

    UserService.subscribe(state => {
        UserNavRef.forEach(nav => useStyles(nav, { display: state.loggedIn === false ? "none !important" : "" }))
        GuestNavRef.forEach(nav => useStyles(nav, { display: state.loggedIn === true ? "none !important" : "" }))
    })

    useEvent(LogoutRef, "click", logout)

    return View
})()

export default Navigation

async function logout() {
    UserService.update(state => {
        state.loggedIn = false
        activateRoute("/login")
        Notifications.push(null, i18n.logoutMessage)
    })
}
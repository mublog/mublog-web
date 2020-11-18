import i18n from "../../lang/de_DE.json"
import Doc, { useEvent, useStyles } from "../../../modules/doc/module"
import { activateRoute } from "./generic"
import Box, { Header } from "./box"
import Notifications from "./notifications"
import { UserService } from "../services/user"

const styleHidden = Doc.createStyle({ display: "none !important" })

const Navigation = (function() {
    const View = Box({ id: "navigation" },
        Header({}, i18n.navigation),
        Doc.createElement("div", { className: "list" },
            Doc.createElement("a", { href: "/" }, i18n.home),
            Doc.createElement("a", { href: "/presentation" }, i18n.presentation),
            Doc.createElement("a", { href: "/login", className: "for-guest" }, i18n.login),
            Doc.createElement("a", { href: "/register", className: "for-guest" }, i18n.register),
            Doc.createElement("a", { className: "for-user action-logout" }, i18n.logout)
        )
    )

    const UserNavRef = Doc.queryAll<HTMLAnchorElement>(View, ".for-user")
    const GuestNavRef = Doc.queryAll<HTMLAnchorElement>(View, ".for-guest")

    UserService.subscribe(({ loggedIn }) => {
        UserNavRef.forEach(nav => loggedIn ? nav.classList.remove(styleHidden) : nav.classList.add(styleHidden))
        GuestNavRef.forEach(nav => !loggedIn ? nav.classList.remove(styleHidden) : nav.classList.add(styleHidden))
    })

    useEvent(Doc.query<HTMLAnchorElement>(View, ".action-logout"), "click", logout)

    return View
})()

export default Navigation

async function logout() {
    UserService.logout(() => {
        activateRoute("/login")
        Notifications.push(null, i18n.logoutMessage)
    })
}
// @ts-check
import i18n from "../../lang/de_DE.js"
import Doc, { useState, useStyles } from "../../../modules/doc/module.js"
import { User } from "../services/fakedb.js"

const Header = (function() {
    const View = Doc.createNode("div", { id: "header" },
        Doc.createNode("div", { className: "header-content" })
    )
    User.subscribe(state => {
        const content = Doc.query(View, "div", ".header-content")
        content.innerHTML = state.alias
        useStyles(View, { 
            display: state.loggedIn === false ? "none !important" : "",
        })
    })
    return View
})()

export default Header
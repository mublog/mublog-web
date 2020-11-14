// @ts-check
import i18n from "../../lang/de_DE.js"

import Doc, { useEvent } from "../../../modules/doc/module.js"
import Box, { Input, Button, Label, Header, Footer } from "../components/box.js"
import Flex from "../components/flex.js"
import { activateRoute } from "../components/generic.js"
import * as pattern from "../definitions/pattern.js"
import Notification from "../components/notifications.js"

import * as db from "../services/fakedb.js"

export default async function Login() {
    const ViewAliasInput = Input({ 
        placeholder: ". . .", 
        required: true, 
        pattern: pattern.userAliasStr
    })
    const ViewPasswordInput = Input({ 
        placeholder: "********", 
        type: "password", 
        required: true, 
        pattern: pattern.userPasswordStr
    })
    
    const View = Box({ id: "login" },
        Header({}, i18n.enterAccount),
        Doc.createNode("form", null,
            Flex({ gap: "8px", direction: "column" },
                Flex({ gap: "8px", direction: "row" },
                    Label({ labelText: i18n.alias }, ViewAliasInput),
                    Label({ labelText: i18n.password }, ViewPasswordInput),
                )
            ),
            Footer({},
                Flex({ gap: "8px", direction: "row" },
                    Button({ type: "submit" }, i18n.login),
                    Button({ className: "register-button", type: "button" }, i18n.noAccount)
                )
            )
        )
    )

    const ViewForm = View.querySelector("form")
    const RegisterButton = View.querySelector(".register-button")

    useEvent(RegisterButton, "click", () => activateRoute("/register"))

    useEvent(ViewForm, "submit", event => {
        event.preventDefault()
        db.login({ alias: ViewAliasInput.value, password: ViewPasswordInput.value })
        if (db.User.value.loggedIn === true) {
            activateRoute("/")
            Notification.push(null, i18n.loginSuccessMessage)
        }
        else {
            Notification.push(null, i18n.loginFailedMessage)
        }
    })

    return View
}
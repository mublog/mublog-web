// @ts-check
import i18n from "../../lang/de_DE.js"

import Doc, { useEvent, useMixin } from "../../../modules/doc/module.js"
import Box, { Button, Label, Header, Footer } from "../components/box.js"
import Flex from "../components/flex.js"
import { activateRoute } from "../components/generic.js"
import * as pattern from "../definitions/pattern.js"
import Notification from "../components/notifications.js"

import * as db from "../services/fakedb.js"

export default async function Login() {    
    const View = Box({ id: "login" },
        Header({}, i18n.enterAccount),
        Doc.createNode("form", null,
            Flex({ gap: "8px", direction: "column" },
                Flex({ gap: "8px", direction: "row" },
                    Label({ labelText: i18n.alias }, 
                        Doc.createNode("div", { className: "input" }, 
                            Doc.createNode("input", {
                                name: "alias", placeholder: ". . .", 
                                required: true, pattern: pattern.userAliasStr
                            })
                        )
                    ),
                    Label({ labelText: i18n.password }, 
                        Doc.createNode("div", { className: "input" }, 
                            Doc.createNode("input", {
                                name: "password",
                                placeholder: "********", type: "password", 
                                required: true, pattern: pattern.userPasswordStr
                            })
                        )
                    )
                )
            ),
            Footer({},
                Flex({ gap: "8px", direction: "row" },
                    Button({ type: "submit" }, i18n.login),
                    Doc.createNode("a", { href: "/register" },
                        Button({ className: "register-button", type: "button" }, i18n.noAccount)
                    )
                )
            )
        )
    )

    const ViewFormRef = Doc.query(View, "form")
    const ViewAliasInputRef = Doc.query(View, "input", "[name='alias']")
    const ViewPasswordInputRef = Doc.query(View, "input", "[name='password']")

    useEvent(ViewFormRef, "submit", async event => {
        event.preventDefault()
        await db.User.login({ alias: ViewAliasInputRef.value, password: ViewPasswordInputRef.value })
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
// @ts-check
import Doc, { useEvent } from "../../../modules/doc/module.js"
import i18n from "../../lang/de_DE.js"
import Box, { Seperator, Button, Label, Header } from "../components/box.js"
import Flex from "../components/flex.js"
import { activateRoute } from "../components/generic.js"
import Notification from "../components/notifications.js"
import * as db from "../services/fakedb.js"

export default async function Register() {
    const View = Box({ id: "register" },
        Header({}, i18n.createAccount),
        Doc.createNode("form", null,
            Flex({ gap: "8px", direction: "row" },
                Label({ labelText: i18n.alias }, 
                    Doc.createNode("div", { className: "input" }, 
                        Doc.createNode("input", { name: "alias", placeholder: i18n.alias })
                    )
                ),
                Label({ labelText: i18n.name }, 
                    Doc.createNode("div", { className: "input" }, 
                        Doc.createNode("input", { name: "name", placeholder: i18n.name })
                    )
                )
            ),
            Flex({ gap: "8px", direction: "row" },
                Label({ labelText: i18n.password }, 
                    Doc.createNode("div", { className: "input" }, 
                        Doc.createNode("input", { name: "password", placeholder: i18n.password, type: "password" })
                    )
                ),
                Label({ labelText: i18n.password },
                    Doc.createNode("div", { className: "input" }, 
                        Doc.createNode("input", { name: "password", placeholder: i18n.password, type: "password" })
                    )
                )
            ),
            Seperator(),
            Flex({ gap: "8px", direction: "row" },
                Button({ type: "submit" }, i18n.register),
                Button({ className: "login-button", type: "button" }, i18n.alreadyAccount)
            )
        )
    )

    const ViewFormRef = Doc.query(View, "form")
    const ViewAliasInputRef = Doc.query(View, "input", "[name='alias']")
    const ViewNameInputRef = Doc.query(View, "input", "[name='name']")
    const ViewLoginButtonRef = Doc.query(View, "button", ".login-button")
    const ViewPasswordRefs = Doc.queryAll(View, "input", "[name='password']")

    useEvent(ViewLoginButtonRef, "click", () => activateRoute("/login"))

    useEvent(ViewFormRef, "submit", event => {
        event.preventDefault()

        if (new Set(ViewPasswordRefs.map(el => el.value)).size !== 1) {
            Notification.push(null, i18n.passwordsNotSame)
            return 
        }

        let success = db.register({
            alias: ViewAliasInputRef.value,
            name: ViewNameInputRef.value,
            password: "ViewPasswordInput1.value",
            profileImageUrl: "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fgame.mthai.com%2Fapp%2Fuploads%2F2016%2F07%2Fragnarok-exe-2.jpg&f=1&nofb=1"
        })
        if (success) {
            Notification.push(null, i18n.registerSuccess)
            ViewFormRef.reset()
        }
        else {
            Notification.push(null, i18n.registerFailed)
        }
    })

    return View
}
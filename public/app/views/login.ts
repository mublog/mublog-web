import i18n from "../../lang/de_DE.json"
import Doc, { useEvent } from "../../../modules/doc/module"
import Box, { Button, Label, Header, Footer } from "../components/box"
import Flex from "../components/flex"
import { activateRoute } from "../components/generic"
import * as pattern from "../definitions/pattern"
import Notification from "../components/notifications"
import { UserService } from "../services/user"

export default async function Login() {    
    const View = Box({ id: "login" },
        Header({}, i18n.enterAccount),
        Doc.createElement("form", null,
            Flex({ gap: "8px", direction: "column" },
                Flex({ gap: "8px", direction: "row" },
                    Label({ labelText: i18n.alias }, 
                        Doc.createElement("div", { className: "input" }, 
                            Doc.createElement("input", {
                                name: "alias", placeholder: ". . .", 
                                required: true, pattern: pattern.userAliasStr
                            })
                        )
                    ),
                    Label({ labelText: i18n.password }, 
                        Doc.createElement("div", { className: "input" }, 
                            Doc.createElement("input", {
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
                    Doc.createElement("a", { href: "/register" },
                        Button({ className: "register-button", type: "button" }, i18n.noAccount)
                    )
                )
            )
        )
    )

    const ViewFormRef = Doc.query<HTMLFormElement>(View, "form")
    const ViewAliasInputRef = Doc.query<HTMLInputElement>(View, "[name='alias']")
    //const ViewPasswordInputRef = Doc.query<HTMLInputElement>(View, "[name='password']")

    useEvent(ViewFormRef, "submit", async event => {
        event.preventDefault()
        UserService.login({ alias: ViewAliasInputRef.value })
        if (UserService.isLoggedIn()) {
            activateRoute("/")
            Notification.push(null, i18n.loginSuccessMessage)
        }
        else {
            Notification.push(null, i18n.loginFailedMessage)
        }
    })

    return View
}
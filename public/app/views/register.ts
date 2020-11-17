import Doc, { useEvent } from "../../../modules/doc/module"
import i18n from "../../lang/de_DE.json"
import Box, { Seperator, Button, Label, Header } from "../components/box"
import Flex from "../components/flex"
import { activateRoute } from "../components/generic"
import Notification from "../components/notifications"
import { UserService } from "../services/user"

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

    const ViewFormRef = Doc.query<HTMLFormElement>(View, "form")
    const ViewAliasInputRef = Doc.query<HTMLInputElement>(View, "[name='alias']")
    const ViewNameInputRef = Doc.query<HTMLInputElement>(View, "[name='name']")
    const ViewLoginButtonRef = Doc.query<HTMLButtonElement>(View, ".login-button")
    const ViewPasswordRefs = Doc.queryAll<HTMLInputElement>(View, "[name='password']")

    useEvent(ViewLoginButtonRef, "click", () => activateRoute("/login"))

    useEvent(ViewFormRef, "submit", async event => {
        event.preventDefault()

        if (new Set(ViewPasswordRefs.map(el => el.value)).size !== 1) {
            Notification.push(null, i18n.passwordsNotSame)
            return 
        }

        let success = UserService.register({
            alias: ViewAliasInputRef.value,
            name: ViewNameInputRef.value,
            //password: ViewPasswordInput1.value,
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
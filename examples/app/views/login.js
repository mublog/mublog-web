// @ts-check
import i18n from "../lang/de_DE.js"

import Box, { Seperator, Title, Input, Button, Label } from "../components/box.js"
import Form from "../components/form.js"
import Flex from "../components/flex.js"
import { activateRoute } from "../components/generic.js"

import * as pattern from "../definitions/pattern.js"
import { UserService } from "../services/db.js"
import Navigation from "../components/navigation.js"
import { loadingCircle } from "../components/decorators.js"

export default async function Login() {
    const alias = Input({ 
        placeholder: ". . .", 
        required: true, 
        pattern: pattern.userAliasStr
    })
    const password = Input({ 
        placeholder: "********", 
        type: "password", 
        required: true, 
        pattern: pattern.userPasswordStr
    })
    
    return Box({ id: "login" },
        Title({ }, i18n.enterAccount),
        Seperator(),
        Form({ },
            Flex({ gap: "8px", direction: "column" },
                Flex({ gap: "8px", direction: "row" },
                    Label({ labelText: i18n.alias }, alias),
                    Label({ labelText: i18n.password }, password),
                )
            ),
            Seperator(),
            Flex({ gap: "8px", direction: "row" },
                Button({ type: "submit" }, i18n.login),
                Button({ type: "button" }, i18n.noAccount)
                    .addEvent("click", () => activateRoute("/register"))
            )
        ).onSubmit(async (node, event) => {
            loadingCircle(node).while(async () => {
                let res = await UserService.login(alias.ref.value, password.ref.value)
                if (res) {
                    Navigation.signal("refresh")
                    activateRoute("/")
                }
                else {
                    alert("fail lol")
                }
            })
        })
    )
}
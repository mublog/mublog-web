// @ts-check
import i18n from "../lang/de_DE.js"

import Box, { Seperator, Title, Input, Button, Label } from "../components/box.js"
import Form from "../components/form.js"
import Flex from "../components/flex.js"

export default async function Register() {
    let component = Box({ id: "register" },
        Title({}, i18n.createAccount),
        Seperator(),
        Form({},
            Flex({},
                Label({ labelText: i18n.alias }, 
                    Input({ placeholder: i18n.alias })
                ),
                Label({ labelText: i18n.name }, 
                    Input({ placeholder: i18n.name })
                )
            ),
            Flex({},
                Label({ labelText: i18n.password }, Input({ placeholder: i18n.password, type: "password" })),
                Label({ labelText: i18n.password }, Input({ placeholder: i18n.password, type: "password" }))
            ),
            Seperator(),
            Flex({ gap: "8px", direction: "row" },
                Button({ type: "submit" }, i18n.register)
            )
        )
    )
    return component
}
// @ts-check
import i18n from "../lang/de_DE.js"

import Box, { Seperator, Title, Input } from "../components/box.js"

export default async function Register() {
    let component = Box({ id: "register" },
        Title({ }, i18n.createAccount),
        Seperator(),
        Input({ 
            placeholder: "placeholder"
        })
    )
    return component
}
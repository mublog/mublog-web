// @ts-check
import Doc, { select, useEvent, useState, useStyles } from "../../../modules/doc/module.js"
import Box, { Seperator, Button, Footer } from "./box.js"
import Flex from "./flex.js"
import i18n from "../../lang/de_DE.js"
import { Icon } from "./generic.js"
import translateMarkDown from "../helpers/mark-down.js"

export default function Writer() {
    const Visibility = useState(false)

    const View = Box({ className: "writer" },
        Doc.createNode("form", { },
            Doc.createNode("div", { },
                Doc.createNode("div", { className: "input" }, 
                    Doc.createNode("textarea", { className: "nested-textarea", placeholder: "Text" })
                ),
                Icon({ name: "magnifier", className: "toggle-post-preview" })
            ),
            Footer({},
                Doc.createNode("div", { className: "mark-down-wrapper" },
                    Box({ className: "mark-down" }),
                    Seperator()
                ),
                Flex({ gap: "8px" },
                    Button({ type: "submit" }, i18n.send)
                )
            )
        )
    )

    const textArea = select(View, ".nested-textarea", "textarea")
    const previewWrapper = select(View, ".mark-down-wrapper", "div")
    const preview = select(View, ".mark-down", "div")

    Visibility.subscribe(val => useStyles(previewWrapper, { display: val === true ? "" : "none" }))
    useEvent(textArea, "input", () => preview.innerHTML = translateMarkDown(textArea.value))
    useEvent(View.querySelector(".toggle-post-preview"), "click", () => {
        Visibility.value = Visibility.value === false ? true : false
    })
    return View
}
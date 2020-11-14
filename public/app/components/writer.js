// @ts-check
import Doc, { useEvent, useMixin, useState, useStyles } from "../../../modules/doc/module.js"
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

    const ViewPreviewRef = Doc.query(View, "div", ".mark-down")
    const ViewTextAreaRef = Doc.query(View, "textarea", ".nested-textarea")
    const ViewPreviewWrapRef = Doc.query(View, "div", ".mark-down-wrapper")

    Visibility.subscribe(val => useStyles(ViewPreviewWrapRef, { display: val === true ? "" : "none" }))
    useEvent(ViewTextAreaRef, "input", () => ViewPreviewRef.innerHTML = translateMarkDown(ViewTextAreaRef.value))
    useEvent(View.querySelector(".toggle-post-preview"), "click", () => {
        Visibility.value = Visibility.value === false ? true : false
    })

    useEvent(View, "submit", event => event.preventDefault())

    const Mixin = useMixin(View, {
        get rawText() {
            return ViewTextAreaRef.value
        },
        get text() {
            return translateMarkDown(ViewTextAreaRef.value)
        },
        reset() {
            ViewTextAreaRef.value = ""
            ViewPreviewRef.innerHTML = ""
            Visibility.value = false
        },
        hidePreview() {
            Visibility.value = false
        },
        showPreview() {
            Visibility.value = true
        },
        /** @param {(event: Event) => any} eventHandler */
        onSubmit(eventHandler) {
            useEvent(Mixin, "submit", eventHandler)
        }
    })

    return Mixin
}
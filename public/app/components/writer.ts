import Doc, { useEvent, useMixin, useState, useStyles } from "../../../modules/doc/module"
import Box, { Seperator, Button, Footer } from "./box"
import Flex from "./flex"
import i18n from "../../lang/de_DE.json"
import { Icon } from "./generic"
import translateMarkDown from "../helpers/mark-down"

export type WriterElement = HTMLDivElement & {
    readonly rawText: string
    readonly text: string
    reset(): void
    hidePreview(): void
    showPreview(): void
    onSubmit(eventHandler: (event: Event) => any): void
}

export default function Writer(props: Partial<HTMLDivElement> = {}): WriterElement {
    const Visibility = useState(false)

    let className = "writer"
    if (props.className) {
        className += " " + props.className
        delete props.className
    }

    const View = Box({ ...props, className },
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

    const ViewPreviewRef = Doc.query<HTMLDivElement>(View, ".mark-down")
    const ViewTextAreaRef = Doc.query<HTMLTextAreaElement>(View, ".nested-textarea")
    const ViewPreviewWrapRef = Doc.query<HTMLDivElement>(View, ".mark-down-wrapper")

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
        reset(): void {
            ViewTextAreaRef.value = ""
            ViewPreviewRef.innerHTML = ""
            Visibility.value = false
        },
        hidePreview(): void {
            Visibility.value = false
        },
        showPreview(): void {
            Visibility.value = true
        },
        onSubmit(eventHandler: (event: Event) => any): void {
            useEvent(Mixin, "submit", eventHandler)
        }
    })

    return Mixin
}
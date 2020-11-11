// @ts-check
import Box, { Seperator, Textarea, Button } from "./box.js"
import Form from "./form.js"
import Flex from "./flex.js"
import i18n from "../../lang/de_DE.js"
import { Div, Icon } from "./generic.js"

export default function Writer() {
    const textArea = Textarea({ placeholder: "Text" })
    const preview = Box({ className: "mark-down" })
    const previewWrapper = Div({ 
        _visible: false,
        className: "mark-down-wrapper",
        styles: { display: "none" }
    },
        preview,
        Seperator()
    )
    const magnifier = Icon("magnifier", {
        className: "toggle-post-preview",
        events: { 
            click: togglePreview
        }
    })

    const component = Box({ className: "writer" },
        Form({}, 
            Div(null, textArea, magnifier),
            Seperator(),
            previewWrapper,
            Flex({ gap: "8px" },
                Button({ type: "submit" }, i18n.send)
            )
        )       
    )
    function togglePreview() {
        previewWrapper.style({ display: previewWrapper.get("_visible") === false ? "unset" : "none" })
        previewWrapper.set("_visible", previewWrapper.get("_visible") === false ? true : false)
    }
    return component
}
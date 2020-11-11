// @ts-check
import Box, { Seperator, Textarea, Button } from "./box.js"
import Form from "./form.js"
import Flex from "./flex.js"
import i18n from "../../lang/de_DE.js"
import { Div } from "./generic.js"

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
    const component = Box({ className: "writer" },
        Form({}, 
            textArea,
            Seperator(),
            previewWrapper,
            Flex({ gap: "8px" },
                Button({ type: "submit" }, i18n.send)
            )
        )       
    )

    textArea.addEvent("dblclick", (node, event) => {
        previewWrapper.style({ display: previewWrapper.get("_visible") === false ? "unset" : "none" })
        previewWrapper.set("_visible", previewWrapper.get("_visible") === false ? true : false)
    })
    return component
}
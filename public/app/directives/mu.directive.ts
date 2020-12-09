import Doc, { onEvent } from "../../mod/doc/mod"
import UserCardPortal from "../components/user-card.component"
import copyToClipboard from "../helpers/copy-to-clipboard"
import i18n from "../../lang/de_DE.json"

Doc.registerDirective("user-card", (el, prop: string) => onEvent(el, "mouseenter", event => {
  UserCardPortal.open({ alias: prop, top: event.clientY, left: event.clientX })
}))

Doc.registerDirective("copyToClipboard", (el, prop: string | (() => string)) => {
  Doc.setProperties(el, { tooltip: i18n.clickToCopy.replace("$c", typeof prop === "function" ? prop() : prop) })
  onEvent(el, "click", () => {
    let content: string
    if (typeof prop === "function") {
      content = prop()
    }
    else if (typeof prop === "string") {
      content = prop
    }
    if (content) {
      copyToClipboard(content)
    }
  })
})

Doc.registerDirective("tooltip", (el, prop) => {
  el.classList.add("tooltip")
  el.appendChild(Doc.createElement("span", { className: "tooltip-text" }, prop))
})
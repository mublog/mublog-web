import Doc, { onEvent, directive } from "../../mod/doc/mod"
import UserCardPortal from "../components/user-card.component"
import copyToClipboard from "../helpers/copy-to-clipboard"
import i18n from "../../lang/de_DE.json"

directive("user-card", (el, prop: string) => onEvent(el, "mouseenter", event => {
  UserCardPortal.open({ alias: prop, top: event.clientY, left: event.clientX })
}))

directive("copyToClipboard", (el, prop) => {
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

directive("tooltip", (el, prop) => {
  el.classList.add("tooltip")
  el.appendChild(Doc.createElement("span", { className: "tooltip-text" }, prop))
})
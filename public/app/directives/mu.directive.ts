import { onEvent, useDirective } from "../../mod/doc/mod"
import UserCardPortal from "../components/user-card.component"
import copyToClipboard from "../helpers/copy-to-clipboard"

useDirective("user-card", (el, prop: string) => onEvent(el, "mouseenter", event => {
  UserCardPortal.open({ alias: prop, top: event.clientY, left: event.clientX })
}))

useDirective("copyToClipboard", (el, prop: any) => onEvent(el, "click", () => {
  let content: string = ""
  if (typeof prop === "function") {
    let propR = prop()
    if (typeof propR === "string") {
      content = propR
    }
  }
  else if (typeof prop === "string") {
    content = prop
  }
  copyToClipboard(content)
}))
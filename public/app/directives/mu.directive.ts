import { onEvent, useDirective } from "../../modules/doc/mod"
import UserCardPortal from "../components/user-card.component"

useDirective("user-card", (el, prop: string) => {
  onEvent("mouseenter", event => {
    UserCardPortal.open({
      alias: prop,
      top: event.clientY,
      left: event.clientX
    })
  })
})
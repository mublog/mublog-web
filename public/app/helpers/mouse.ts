import { onGlobalEvent } from "../../modules/doc/mod"

export let mouseX = 0
export let mouseY = 0

onGlobalEvent("mousemove", event => {
  mouseX = event.clientX
  mouseY = event.clientY
})
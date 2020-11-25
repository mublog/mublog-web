import { Hooks, Destroy } from "./symbols"
import { cursor, runMount, runDestroy } from "./element"

export function onAttributeChange(fn: AttributeChangedCallback, attributes: string[]) {
  let el = cursor()
  AttributeCallbacks.push(fn)
  el[Hooks][Destroy].push(() => {
    const index = AttributeCallbacks.indexOf(fn)
    if (index !== -1) {
      AttributeCallbacks.splice(index, 1)
    }
  })
  AttributeObserver.observe(el, { attributeFilter: attributes, attributeOldValue: true, attributes: true })
}

const AttributeCallbacks = []
const AttributeObserver = new MutationObserver(rec => rec.forEach(({ type, attributeName, oldValue, }) => {
  if (type === "attributes") AttributeCallbacks.forEach(cb => cb(attributeName, oldValue))
}))

const DOMObserver = new MutationObserver(rec => rec.forEach(({ type, removedNodes, addedNodes }) => {
  if (type !== "childList") return
  if (removedNodes.length > 0) {
    Array.from(removedNodes).forEach((el: HTMLElement) => {
      if (el[Hooks]) runDestroy(el)
    })
  }
  if (addedNodes.length > 0) {
    Array.from(addedNodes).forEach((el: HTMLElement) => {
      if (el[Hooks]) runMount(el)
    })
  }
}))
DOMObserver.observe(document.body, { subtree: true, childList: true })
import { each, eachFn } from "./helper"
import { Hooks, Mount, Destroy } from "./globals"

const DOMObserver = new MutationObserver(DOMNotifier)
function DOMNotifier(recs: MutationRecord[]) {
  each(recs, ({ type, removedNodes, addedNodes }: MutationRecord) => {
    if (type !== "childList") return
    if (removedNodes) each(Array.from(removedNodes), runDestroy)
    if (addedNodes) each(Array.from(addedNodes), runMount)
  })
}
DOMObserver.observe(document.body, { subtree: true, childList: true })

function runMount(el: HTMLElement) {
  if (el[Hooks]) eachFn(el[Hooks][Mount], el)
  if (el.children) each(Array.from(el.children), runMount)
}

function runDestroy(el: HTMLElement) {
  if (el[Hooks]) eachFn(el[Hooks][Destroy], el)
  if (el.children) each(Array.from(el.children), runDestroy)
  el = undefined
}
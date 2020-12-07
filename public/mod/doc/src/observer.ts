import { runMount, runDestroy } from "./element"
import { each } from "./helper"

const DOMObserver = new MutationObserver(DOMNotifier)
function DOMNotifier(recs: MutationRecord[]) {
  each(recs, ({ type, removedNodes, addedNodes }: MutationRecord) => {
    if (type !== "childList") return
    if (removedNodes) each(Array.from(removedNodes), runDestroy)
    if (addedNodes) each(Array.from(addedNodes), runMount)
  })
}
DOMObserver.observe(document.body, { subtree: true, childList: true })
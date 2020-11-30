import { runMount, runDestroy } from "./element"
import { each, eachFn } from "./helper"
import { onDestroy } from "./lifecycle"
import { cursor } from "./globals"

export function onAttributeChange(fn: AttributeChangedCallback, attributes: string[]) {
  let el = cursor()
  AttributeCallbacks.push(fn)
  onDestroy(() => {
    const index = AttributeCallbacks.indexOf(fn)
    if (index !== -1) {
      AttributeCallbacks.splice(index, 1)
    }
  })
  AttributeObserver.observe(el, { attributeFilter: attributes, attributeOldValue: true, attributes: true })
}

const AttributeCallbacks = []
const AttributeObserver = new MutationObserver(attributeNotifer)
function attributeNotifer(recs: MutationRecord[]) {
  each(recs, ({ type, attributeName, oldValue }: MutationRecord) => {
    if (type !== "attributes") return
    eachFn(AttributeCallbacks, attributeName, oldValue)
  })
}

const DOMObserver = new MutationObserver(DOMNotifier)
function DOMNotifier(recs: MutationRecord[]) {
  each(recs, ({ type, removedNodes, addedNodes }: MutationRecord) => {
    if (type !== "childList") return
    each(Array.from(removedNodes), runDestroy)
    each(Array.from(addedNodes), runMount)
  })
}
DOMObserver.observe(document.body, { subtree: true, childList: true })
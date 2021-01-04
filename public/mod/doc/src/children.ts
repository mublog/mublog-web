import { fragment, text } from "./elements"
import { T_STRING, T_NUMBER } from "./types"
import { lifeCycle } from "./helper"
import { Destroy } from "./globals"

export function render(el: HTMLElement, ...children: HTMLElement[]) {
  el.innerHTML = ""
  appendChildren(el, children, el)
}

export function appendChildren(el: DocumentFragment | HTMLElement, children: any[], $el: HTMLElement) {
  let frag = fragment()
  const len = children.length
  if (len > 0) {
    for (let i = 0; i < len; i++) {
      if (children[i] === undefined) continue
      if (children[i] === null) continue
      if (Array.isArray(children[i])) {
        appendChildren(frag, children[i], $el)
      }
      else if (typeof children[i] === T_STRING || typeof children[i] === T_NUMBER) {
        frag.appendChild(text(children[i]))
      }
      else if (children[i] instanceof Element) {
        frag.appendChild(children[i])
      }
      else if (children[i].subscribe) {
        let stateValue = children[i].value()
        if (typeof stateValue === T_STRING || typeof stateValue === T_NUMBER) {
          let state: Subscribable<number | string> = children[i]
          let content = text(state.value())
          frag.appendChild(content)
          lifeCycle($el, Destroy, state.subscribe(val => {
            let newVal = val + ""
            if (content.textContent !== newVal) content.textContent = newVal
          }))
        }
        else if (stateValue instanceof Element) {
          let state: Subscribable<Element> = children[i]
          frag.appendChild(state.value())
          lifeCycle($el, Destroy, state.subscribe(val => {
            state.value().replaceWith(val)
          }))
        }
      }
    }
    el.appendChild(frag)
  }
}
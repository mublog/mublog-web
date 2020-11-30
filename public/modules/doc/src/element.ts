import { Hooks, Mount, BeforeUpdate, AfterUpdate, Destroy, Events, Directives, cursor } from "./globals"
import { onEvent } from "./events"
import { blank, each, eachFn, prepareForList } from "./helper"
import { onDestroy } from "./lifecycle"
import { useDirective } from "./core"
import { ifDirective, portalDirective, referenceDirective, stylesDirective } from "./directives"

function element<Tag extends HTMLTag>(type: Tag): HTMLElementTagNameMap[Tag] {
  let el = document.createElement(type)
  prepareHooks(el)
  return el
}

function text(content: string | number) {
  return document.createTextNode(content + "")
}

function fragment() {
  return document.createDocumentFragment()
}

export function createElement<Tag extends HTMLTag>(type: Tag, props: HTMLOptions<Tag>, ...children: Child[]) {
  if (typeof type === "function") {
    // @ts-expect-error
    return type(props, ...children)
  }
  let el = element(type)
  properties(el, props)
  appendChildren(el, children)
  cursor(el)
  return el
}

function prepareHooks(el: HTMLElement) {
  el[Hooks] = blank()
  el[Hooks][Mount] = []
  el[Hooks][BeforeUpdate] = []
  el[Hooks][AfterUpdate] = []
  el[Hooks][Destroy] = []
  el[Hooks][Events] = blank()
}

export function render(el: HTMLElement, ...children: HTMLElement[]) {
  el.innerHTML = ""
  appendChildren(el, children)
}

function appendChildren(el: DocumentFragment | HTMLElement, children: any[]) {
  let frag = fragment()
  let i = 0
  const len = children.length
  if (len > 0) {
    for (i; i < len; i++) {
      if (Array.isArray(children[i])) {
        appendChildren(frag, children[i])
      }
      else if (typeof children[i] === "string" || typeof children[i] === "number") {
        frag.appendChild(text(children[i]))
      }
      else if (children[i] instanceof Element) {
        frag.appendChild(children[i])
      }
      else if (children[i].subscribe) {
        let stateValue = children[i].get()
        if (typeof stateValue === "string" || typeof stateValue === "number") {
          let state: Subscribable<number | string> = children[i]
          let content = text(state.get())
          frag.appendChild(content)
          onDestroy(state.subscribe(val => {
            eachFn(el[Hooks][BeforeUpdate])
            let newVal = val + ""
            if (content.textContent !== newVal) {
              content.textContent = newVal
            }
            eachFn(el[Hooks][AfterUpdate])
          }))
        }
        else if (stateValue instanceof Element) {
          let state: Subscribable<Element> = children[i]
          frag.appendChild(state.get())
          onDestroy(state.subscribe(val => {
            eachFn(el[Hooks][BeforeUpdate])
            state.get().replaceWith(val)
            eachFn(el[Hooks][AfterUpdate])
          }))
        }
      }
    }
    el.appendChild(frag)
  }
}

function writeSubscribableProperty(el: HTMLElement, key: string, property: Subscribable<any>) {
  let state: Subscribable<any> = property
  el[key] = state.get()
  onDestroy(state.subscribe(val => {
    eachFn(el[Hooks][BeforeUpdate])
    if (el[key] !== val) el[key] = val
    eachFn(el[Hooks][AfterUpdate])
  }))
}

function writeDefault(el: HTMLElement, key: string, property: any) {
  cursor(el)
  if (property.subscribe) {
    writeSubscribableProperty(el, key, property)
  }
  else if (key.startsWith("on") && typeof property === "function") {
    onEvent(key.slice(2) as EventNames, property)
  }
  else {
    el[key] = property
  }
}

useDirective("for", (el: HTMLElement, property: DocDirectives["for"]) => {
  let sort: (a: any, b: any) => number = property.sort
  let filter: (value: any, index: number) => unknown = property.filter
  let limit: number = property.limit
  let offset: number = property.offset
  if (Array.isArray(property.of)) {
    if (property.of && Array.isArray(property.of)) {
      let com: HTMLComponent<any> = property.do
      let copy = prepareForList(property.of, { sort, filter, limit, offset })
      render(el, ...copy.map(com))
    }
  }
  else if (property.of && property.of.subscribe) {
    let list: Subscribable<any[]> = property.of
    let com: HTMLComponent<any> = property.do
    onDestroy(list.subscribe(val => {
      eachFn(el[Hooks][BeforeUpdate])
      let copy = prepareForList(val, { sort, filter, limit, offset })
      render(el, ...copy.map(com))
      eachFn(el[Hooks][AfterUpdate])
    }))
  }
})

useDirective("styles", stylesDirective)
useDirective("if", ifDirective)
useDirective("ref", referenceDirective)
useDirective("portal", portalDirective)

function properties(el: HTMLElement, props: any) {
  for (let key in props) {
    if (Directives[key]) {
      Directives[key](el, props[key])
    }
    else {
      writeDefault(el, key, props[key])
    }
  }
}

export function runMount(el: HTMLElement) {
  if (el[Hooks]) {
    eachFn(el[Hooks][Mount])
  }
  if (el.children) {
    each(Array.from(el.children), runMount)
  }
}

export function runDestroy(el: HTMLElement) {
  if (el[Hooks]) {
    eachFn(el[Hooks][Destroy])
  }
  if (el.children) {
    each(Array.from(el.children), runDestroy)
  }
  el = undefined
}
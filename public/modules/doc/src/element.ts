import { Hooks, Mount, BeforeUpdate, AfterUpdate, Destroy, Events, Directives, cursor } from "./globals"
import { onEvent } from "./events"
import { blank, each, eachFn } from "./helper"
import { useStyles } from "./styles"
import { onDestroy } from "./lifecycle"
import { useDirective } from "./directives"

function element<Tag extends HTMLTag>(type: Tag): HTMLElementTagNameMap[Tag] {
  let el = document.createElement(type)
  cursor(el)
  prepareHooks()
  return el
}

function text(content: string | number) {
  return document.createTextNode(content + "")
}

function fragment() {
  return document.createDocumentFragment()
}

function comment(text: string) {
  return document.createComment(text)
}

export function createElement<Tag extends HTMLTag>(type: Tag, props: HTMLOptions<Tag>, ...children: Child[]) {
  if (typeof type === "function") {
    // @ts-expect-error
    return type(props, ...children)
  }
  let el = element(type)
  properties(props)
  appendChildren(children)
  return el
}

function prepareHooks() {
  let el = cursor()
  el[Hooks] = blank()
  el[Hooks][Mount] = []
  el[Hooks][BeforeUpdate] = []
  el[Hooks][AfterUpdate] = []
  el[Hooks][Destroy] = []
  el[Hooks][Events] = blank()
}

export function render(target: HTMLElement, ...children: HTMLElement[]) {
  target.innerHTML = ""
  cursor(target)
  appendChildren(children)
}

function appendChildren(children: any[]) {
  let el = cursor()
  let frag = fragment()
  let i = 0
  const len = children.length
  if (len > 0) {
    for (i; i < len; i++) {
      if (Array.isArray(children[i])) {
        cursor(frag as unknown as HTMLElement)
        appendChildren(children[i])
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
  cursor(el)
}

function attribute(el: HTMLElement, name: string, value?: string) {
  if (value === undefined) {
    el.removeAttribute(name)
  }
  else {
    el.setAttribute(name, value)
  }
}

function prepareForList(list: any[], { sort, filter, limit }) {
  let copy = [...list]
  if (filter) copy = copy.filter(filter)
  if (sort) copy = copy.sort(sort)
  if (typeof limit === "number") copy.length = limit
  return copy
}

function writeSubscribableProperty(key: string, property: Subscribable<any>) {
  let el = cursor()
  let state: Subscribable<any> = property
  el[key] = state.get()
  onDestroy(state.subscribe(val => {
    eachFn(el[Hooks][BeforeUpdate])
    if (el[key] !== val) el[key] = val
    eachFn(el[Hooks][AfterUpdate])
  }))
}

function writeDefault(key: string, property: any) {
  let el = cursor()
  if (property.subscribe) {
    writeSubscribableProperty(key, property)
  }
  else if (key.startsWith("on") && typeof property === "function") {
    onEvent(key.slice(2) as EventNames, property)
  }
  else {
    el[key] = property
  }
}

useDirective("for", property => {
  let el = cursor()
  let sort: (a: any, b: any) => number = property.sort
  let filter: (value: any, index: number) => unknown = property.filter
  let limit: number = property.limit
  if (property.of && Array.isArray(property.of)) {
    let com: HTMLComponent<any> = property.do
    let copy = prepareForList(property.of, { sort, filter, limit })
    render(el, ...copy.map(com))
  }
  else if (property.of && property.of.subscribe) {
    let list: Subscribable<any[]> = property.of
    let com: HTMLComponent<any> = property.do
    onDestroy(list.subscribe(val => {
      eachFn(el[Hooks][BeforeUpdate])
      let copy = prepareForList(val, { sort, filter, limit })
      render(el, ...copy.map(com))
      eachFn(el[Hooks][AfterUpdate])
    }))
  }
})

useDirective("styles", property => {
  let el = cursor()
  if (property.subscribe) {
    let state: Subscribable<Partial<CSSStyleDeclaration>> = property
    onDestroy(state.subscribe(rules => {
      eachFn(el[Hooks][BeforeUpdate])
      useStyles(el, rules)
      eachFn(el[Hooks][AfterUpdate])
    }))
  }
  else {
    useStyles(el, property)
  }
})

useDirective("if", property => {
  let el = cursor()
  if (property.subscribe) {
    let state: Subscribable<boolean> = property
    onDestroy(state.subscribe(val => {
      if (val === true) {
        eachFn(el[Hooks][BeforeUpdate])
        attribute(el, "hidden")
        eachFn(el[Hooks][AfterUpdate])
      }
      else if (val === false) {
        attribute(el, "hidden", "")
      }
    }))
  }
  else {
    if (property === false) {
      attribute(el, "hidden", "true")
    }
  }
})

useDirective("ref", (property: Reference<any>) => {
  let el = cursor()
  if (property.isRef) {
    property.current = el
  }
})

useDirective("portal", (property: Portal<any>) => {
  let el = cursor()
  if (property.isPortal) {
    property.set(el)
  }
})

function properties(props: any) {
  for (let key in props) {
    if (Directives[key]) {
      Directives[key](props[key])
    }
    else {
      writeDefault(key, props[key])
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
import { Hooks, Mount, BeforeUpdate, AfterUpdate, Destroy } from "./symbols"
import { onEvent } from "./events"
import { useStyles } from "./styles"
import { onDestroy } from "./lifecycle"

let currentElement: HTMLElement

export function cursor(el?: HTMLElement): HTMLElement {
  if (el) {
    currentElement = el
  }
  return currentElement
}

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
  el[Hooks] = Object.create(null)
  el[Hooks][Mount] = []
  el[Hooks][BeforeUpdate] = []
  el[Hooks][AfterUpdate] = []
  el[Hooks][Destroy] = []
}

export function render(target: HTMLElement, ...children: HTMLElement[]) {
  target.innerHTML = ""
  cursor(target)
  appendChildren(children)
}

function appendChildren(children: any[]) {
  let el = cursor()
  let frag = fragment()
  children.forEach(child => {
    if (Array.isArray(child)) {
      cursor(frag as unknown as HTMLElement)
      appendChildren(child)
    }
    else if (typeof child === "string" || typeof child === "number") {
      frag.appendChild(text(child))
    }
    else if (child instanceof Element) {
      frag.appendChild(child)
    }
    else if (child.subscribe) {
      let stateValue = child.get()
      if (typeof stateValue === "string" || typeof stateValue === "number") {
        let state: Subscribable<number | string> = child
        let content = text(state.get())
        frag.appendChild(content)
        cursor(el)
        onDestroy(state.subscribe(val => {
          runAll(el[Hooks][BeforeUpdate])
          let newVal = val + ""
          if (content.textContent !== newVal) {
            content.textContent = newVal
          }
          runAll(el[Hooks][AfterUpdate])
        }))
      }
      else if (stateValue instanceof Element) {
        let state: Subscribable<Element> = child
        frag.appendChild(state.get())
        cursor(el)
        onDestroy(state.subscribe(val => {
          runAll(el[Hooks][BeforeUpdate])
          state.get().replaceWith(val)
          runAll(el[Hooks][AfterUpdate])
        }))
      }
    }
  })
  el.appendChild(frag)
}

function attribute(el: HTMLElement, name: string, value?: string) {
  if (value === undefined) {
    el.removeAttribute(name)
  }
  else {
    el.setAttribute(name, value)
  }
}

function writeFor(property: any) {
  let el = cursor()
  let sort: (a: any, b: any) => number = property.sort
  let filter: (value: any, index: number) => unknown = property.filter
  if (property.of && Array.isArray(property.of)) {
    let com: HTMLComponent<any> = property.do
    let copy: any[] = [...property.of]
    if (sort) copy = copy.sort(sort)
    if (filter) copy = copy.filter(filter)
    render(el, ...copy.map(com))
  }
  else if (property.of && property.of.subscribe) {
    let list: Subscribable<any[]> = property.of
    let com: HTMLComponent<any> = property.do
    cursor(el)
    onDestroy(list.subscribe(val => {
      runAll(el[Hooks][BeforeUpdate])
      let copy = [...val]
      if (sort) copy = copy.sort(sort)
      if (filter) copy = copy.filter(filter)
      render(el, ...copy.map(com))
      runAll(el[Hooks][AfterUpdate])
    }))
  }
}

function writeStyle(property: any) {
  let el = cursor()
  if (property.subscribe) {
    let state: Subscribable<Partial<CSSStyleDeclaration>> = property
    onDestroy(state.subscribe(rules => {
      runAll(el[Hooks][BeforeUpdate])
      useStyles(el, rules)
      runAll(el[Hooks][AfterUpdate])
    }))
  }
  else {
    useStyles(el, property)
  }
}

function writeIf(property: any) {
  let el = cursor()
  if (property.subscribe) {
    let state: Subscribable<boolean> = property
    onDestroy(state.subscribe(val => {
      if (val === true) {
        runAll(el[Hooks][BeforeUpdate])
        attribute(el, "hidden")
        runAll(el[Hooks][AfterUpdate])
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
}

function writeSubscribableProperty(key: string, property: Subscribable<any>) {
  let el = cursor()
  let state: Subscribable<any> = property
  el[key] = state.get()
  onDestroy(state.subscribe(val => {
    runAll(el[Hooks][BeforeUpdate])
    if (el[key] !== val) {
      el[key] = val
    }
    runAll(el[Hooks][AfterUpdate])
  }))
}

function writeRest(key: string, property: any) {
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

function writeRef(property: any) {
  let el = cursor()
  if (property.isRef) {
    property.set(el)
  }
}

function properties(props: any) {
  for (let key in props) {
    switch (key) {
      case "for":
        writeFor(props[key])
        break
      case "styles":
        writeStyle(props[key])
        break
      case "if":
        writeIf(props[key])
        break
      case "ref":
        writeRef(props[key])
        break
      default:
        writeRest(key, props[key])
        break
    }
  }
}

export function runAll(fns: ((...args: any[]) => any)[]) {
  fns && fns.length ? fns.forEach(fn => fn()) : void null
}

export function runMount(el: HTMLElement) {
  if (el[Hooks]) {
    runAll(el[Hooks][Mount])
  }
}

export function runDestroy(el: HTMLElement) {
  if (el[Hooks]) {
    runAll(el[Hooks][Destroy])
  }
  Array.from(el.children).forEach(runDestroy)
}
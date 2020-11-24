import { Hooks, Mount, BeforeUpdate, AfterUpdate, Destroy } from "./symbols"
import { onDestroy } from "./lifecycle"
import { onEvent } from "./events"
import { useStyles } from "./styles"

let currentElement: HTMLElement

export function cursor(el?: HTMLElement): HTMLElement {
  if (el) {
    currentElement = el
  }
  return currentElement
}

export function element<Tag extends HTMLTag>(type: Tag): HTMLElementTagNameMap[Tag] {
  let el = document.createElement(type)
  cursor(el)
  prepareHooks()
  return el
}

export function fragment() {
  return document.createDocumentFragment()
}

export function comment(text: string) {
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

function removeHooks() {
  let el = cursor()
  delete el[Hooks]
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
    else if (child.isState) {
      let stateValue = child.get()
      if (typeof stateValue === "string" || typeof stateValue === "number") {
        let state: State<number | string> = child
        let content = text(state.get())
        frag.appendChild(content)
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
        let state: State<Element> = child
        frag.appendChild(state.get())
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

export function text(content: string | number) {
  return document.createTextNode(content + "")
}

function attribute(el: HTMLElement, name: string, value?: string) {
  if (value === undefined) {
    el.removeAttribute(name)
  }
  else {
    el.setAttribute(name, value)
  }
}

function properties(props: any) {
  let el = cursor()
  for (let key in props) {
    if (key === "for") {
      if (props[key].of && Array.isArray(props[key].of)) {
        let list: any[] = props[key].of
        let com: HTMLComponent<any> = props[key].do
        render(el, ...list.map(com))
      }
      else if (props[key].of && (props[key].of.isStore || props[key].of.isState)) {
        let list: State<any[]> | Store<any> = props[key].of
        let com: HTMLComponent<any> = props[key].do
        onDestroy(list.subscribe(val => {
          runAll(el[Hooks][BeforeUpdate])
          render(el, ...val.map(com))
          runAll(el[Hooks][AfterUpdate])
        }))
      }
    }
    else if (key === "styles") {
      if (props[key].isState) {
        let state: State<Partial<CSSStyleDeclaration>> = props[key]
        onDestroy(state.subscribe(rules => {
          runAll(el[Hooks][BeforeUpdate])
          useStyles(el, rules)
          runAll(el[Hooks][AfterUpdate])
        }))
      }
      else {
        useStyles(el, props[key])
      }
    }
    else if (key === "if") {
      if (props[key].isState) {
        let state: State<boolean> = props[key]
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
        if (!props[key]) {
          attribute(el, "hidden", "true")
        }
      }
    }
    else if (props[key].isState) {
      let state: State<any> = props[key]
      el[key] = state.get()
      onDestroy(state.subscribe(val => {
        runAll(el[Hooks][BeforeUpdate])
        if (el[key] !== val) {
          el[key] = val
        }
        runAll(el[Hooks][AfterUpdate])
      }))
    }
    else if (key === "ref" && props[key].isRef) {
      props[key].set(el)
    }
    else if (key.startsWith("on") && typeof props[key] === "function") {
      onEvent(key.slice(2) as EventNames, props[key])
    }
    else {
      el[key] = props[key]
    }
  }
}

export function runAll(fns: ((...args: any[]) => any)[]) {
  fns && fns.length ? fns.forEach(fn => fn()) : void null
}

export function destroy(el: HTMLElement) {
  cursor(el)
  if (el[Hooks]) {
    runAll(el[Hooks][Destroy])
  }
  removeHooks()
  Array.from(el.children).forEach(destroy)
}

export function mount(el: HTMLElement, target: HTMLElement) {
  if (el && target) {
    cursor(el)
    target.replaceWith(el)
  }
}

export function query<Target extends HTMLElement>(selector: string): Target {
  let el = cursor()
  if (el) {
    return el.querySelector(selector) as Target
  }
}

export function queryAll<Target extends HTMLElement>(selector: string): Target[] {
  let el = cursor()
  if (el) {
    return Array.from(el.querySelectorAll(selector)) as Target[]
  }
  return []
}

export function filter<Target extends HTMLElement>(predicate: (value: Target, index: number, array: Target[]) => unknown): Target[] {
  return queryAll<Target>("*").filter(predicate)
}

export function find<Target extends HTMLElement>(predicate: (value: Target, index: number, array: Target[]) => unknown): Target {
  return queryAll<Target>("*").find(predicate)
}
import { Hooks, Mount, Destroy, Events, Directives } from "./globals"
import { onEvent } from "./events"
import { T_STRING, T_NUMBER, T_FUNCTION } from "./types"
import { blank, each, eachFn, keysOf, prepareForList } from "./helper"
import * as directives from "./directives"

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

function comment(text: string) {
  return document.createComment(text)
}

export function registerDirective(name: string, fn: (el: HTMLElement, property: any) => any) {
  Directives[name] = fn
}

export function unregisterDirective(name: string) {
  delete Directives[name]
}

export function createElement<Tag extends HTMLTag>(type: Tag, props: HTMLOptions<Tag>, ...children: Child[]) {
  // @ts-expect-error
  if (typeof type === T_FUNCTION) return type(props, ...children)
  let el = element(type)
  setProperties(el, props)
  appendChildren(el, children, el)
  return el
}

export const h = createElement

function prepareHooks(el: HTMLElement) {
  el[Hooks] = blank()
  el[Hooks][Mount] = []
  el[Hooks][Destroy] = []
  el[Hooks][Events] = blank()
}

export function render(el: HTMLElement, ...children: HTMLElement[]) {
  el.innerHTML = ""
  appendChildren(el, children, el)
}

function appendChildren(el: DocumentFragment | HTMLElement, children: any[], $el: HTMLElement) {
  let frag = fragment()
  const len = children.length
  if (len > 0) {
    for (let i = 0; i < len; i++) {
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
          directives.destroyDirective($el, state.subscribe(val => {
            let newVal = val + ""
            if (content.textContent !== newVal) content.textContent = newVal
          }))
        }
        else if (stateValue instanceof Element) {
          let state: Subscribable<Element> = children[i]
          frag.appendChild(state.value())
          directives.destroyDirective($el, state.subscribe(val => {
            state.value().replaceWith(val)
          }))
        }
      }
    }
    el.appendChild(frag)
  }
}

function writeSubscribableProperty(el: HTMLElement, key: string, property: Subscribable<any>) {
  let state: Subscribable<any> = property
  el[key] = state.value()
  directives.destroyDirective(el, state.subscribe(val => {
    if (el[key] !== val) el[key] = val
  }))
}

function writeDefault(el: HTMLElement, key: string, property: any) {
  if (property === undefined) return
  if (property.subscribe) {
    writeSubscribableProperty(el, key, property)
  }
  else if (key.startsWith("on") && typeof property === T_FUNCTION) {
    onEvent(el, key.slice(2) as EventNames, property)
  }
  else {
    el[key] = property
  }
}

registerDirective("for", (el: HTMLElement, prop: DocDirectives["for"]) => {
  let sort: (a: any, b: any) => number = prop.sort
  let filter: (value: any, index: number) => unknown = prop.filter
  let limit: number = prop.limit
  let offset: number = prop.offset
  let com: HTMLComponent<any> = prop.do
  if (prop.of) {
    if (Array.isArray(prop.of)) {
      let copy = prepareForList(prop.of, { sort, filter, limit, offset })
      render(el, ...copy.map(com))
    }
    else if (prop.of && prop.of.subscribe) {
      let list: Subscribable<any[]> = prop.of
      directives.destroyDirective(el, list.subscribe(val => {
        let copy = prepareForList(val, { sort, filter, limit, offset })
        render(el, ...copy.map(com))
      }))
    }
  }
})

registerDirective("styles", directives.stylesDirective)
registerDirective("if", directives.ifDirective)
registerDirective("ref", directives.referenceDirective)
registerDirective("portal", directives.portalDirective)
registerDirective("mount", directives.mountDirective)
registerDirective("destroy", directives.destroyDirective)
registerDirective("interval", directives.intervalDirective)

export function setProperties(el: HTMLElement, props: any) {
  const keys = keysOf(props)
  keys.forEach(key => {
    const dir = Directives[key]
    dir ? dir(el, props[key]) : writeDefault(el, key, props[key])
  })
}
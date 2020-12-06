import { Hooks, Mount, BeforeUpdate, AfterUpdate, Destroy, Events, Directives, cursor } from "./globals"
import { onEvent } from "./events"
import { T_STRING, T_NUMBER, T_FUNCTION } from "./types"
import { blank, each, eachFn, keysOf, prepareForList } from "./helper"
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

function comment(text: string) {
  return document.createComment(text)
}

export function createElement<Tag extends HTMLTag>(type: Tag, props: HTMLOptions<Tag>, ...children: Child[]) {
  if (typeof type === T_FUNCTION) {
    // @ts-expect-error
    return type(props, ...children)
  }
  let el = element(type)
  properties(el, props)
  appendChildren(el, children, el)
  cursor(el)
  return el
}

export const h = createElement

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
  appendChildren(el, children, el)
}

function appendElement(el: DocumentFragment | HTMLElement, child: HTMLElement) {
  el.appendChild(child)
}

function appendTextLike(el: DocumentFragment | HTMLElement, child: string | number) {
  el.appendChild(text(child))
}

function appendChildren(el: DocumentFragment | HTMLElement, children: any[], $el: HTMLElement) {
  let frag = fragment()
  cursor($el)
  const len = children.length
  if (len > 0) {
    for (let i = 0; i < len; i++) {
      if (Array.isArray(children[i])) {
        appendChildren(frag, children[i], $el)
      }
      else if (typeof children[i] === T_STRING || typeof children[i] === T_NUMBER) {
        appendTextLike(frag, children[i])
      }
      else if (children[i] instanceof Element) {
        appendElement(frag, children[i])
      }
      else if (children[i].subscribe) {
        let stateValue = children[i].value()
        if (typeof stateValue === T_STRING || typeof stateValue === T_NUMBER) {
          let state: Subscribable<number | string> = children[i]
          let content = text(state.value())
          frag.appendChild(content)
          onDestroy(state.subscribe(val => {
            eachFn($el[Hooks][BeforeUpdate])
            let newVal = val + ""
            if (content.textContent !== newVal) {
              content.textContent = newVal
            }
            eachFn($el[Hooks][AfterUpdate])
          }))
        }
        else if (stateValue instanceof Element) {
          let state: Subscribable<Element> = children[i]
          frag.appendChild(state.value())
          onDestroy(state.subscribe(val => {
            eachFn($el[Hooks][BeforeUpdate])
            state.value().replaceWith(val)
            eachFn($el[Hooks][AfterUpdate])
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
  onDestroy(state.subscribe(val => {
    eachFn(el[Hooks][BeforeUpdate])
    if (el[key] !== val) el[key] = val
    eachFn(el[Hooks][AfterUpdate])
  }))
}

function writeDefault(el: HTMLElement, key: string, property: any) {
  if (property !== undefined) {
    if (property.subscribe) {
      writeSubscribableProperty(el, key, property)
    }
    else if (key.startsWith("on") && typeof property === T_FUNCTION) {
      onEvent(key.slice(2) as EventNames, property)
    }
    else {
      el[key] = property
    }
  }
}

useDirective("for", (el: HTMLElement, prop: DocDirectives["for"]) => {
  let sort: (a: any, b: any) => number = prop.sort
  let filter: (value: any, index: number) => unknown = prop.filter
  let limit: number = prop.limit
  let offset: number = prop.offset
  let com: HTMLComponent<any> = prop.do
  if (Array.isArray(prop.of)) {
    if (prop.of && Array.isArray(prop.of)) {
      let copy = prepareForList(prop.of, { sort, filter, limit, offset })
      render(el, ...copy.map(com))
    }
  }
  else if (prop.of && prop.of.subscribe) {
    let list: Subscribable<any[]> = prop.of
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
  const keys = keysOf(props)
  cursor(el)
  keys.forEach(key => {
    const dir = Directives[key]
    dir ? dir(el, props[key]) : writeDefault(el, key, props[key])
  })
}

export function runMount(el: HTMLElement) {
  if (el[Hooks]) eachFn(el[Hooks][Mount])
  if (el.children) each(Array.from(el.children), runMount)
}

export function runDestroy(el: HTMLElement) {
  if (el[Hooks]) eachFn(el[Hooks][Destroy])
  if (el.children) each(Array.from(el.children), runDestroy)
  el = undefined
}
import { setProperties, appendChildren } from "./doc"
import { Hooks, Mount, Destroy, Events } from "./globals"
import { blank } from "./helper"
import { T_FUNCTION } from "./types"

export function element<Tag extends HTMLTag>(type: Tag): HTMLElementTagNameMap[Tag] {
  let el = document.createElement(type)
  prepareHooks(el)
  return el
}

export function text(content: string | number) {
  return document.createTextNode(content + "")
}

export function fragment() {
  return document.createDocumentFragment()
}

export function comment(text: string) {
  return document.createComment(text)
}

function prepareHooks(el: HTMLElement) {
  el[Hooks] = blank()
  el[Hooks][Mount] = []
  el[Hooks][Destroy] = []
  el[Hooks][Events] = blank()
}

export function createElement<Tag extends HTMLTag>(type: Tag, props: HTMLOptions<Tag>, ...children: Child[]): HTMLElementTagNameMap[Tag] {
  // @ts-expect-error
  if (typeof type === T_FUNCTION) return type(props, ...children)
  let el = element(type)
  setProperties(el, props)
  appendChildren(el, children, el)
  return el
}
import { setProperties } from "./properties"
import { appendChildren } from "./children"
import { Hooks, Mount, Destroy, Events } from "./globals"
import { blank } from "./helper"
import { T_FUNCTION } from "./types"

export function element<Tag extends HTMLTag>(type: Tag): HTMLElementTagNameMap[Tag] {
  let el = document.createElement(type)
  prepareHooks(el)
  return el
}

export const text = (data: string | number) => document.createTextNode(data + "")
export const fragment = () => document.createDocumentFragment()
export const comment = (data: string) => document.createComment(data)

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
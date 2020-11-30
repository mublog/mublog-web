import { blank } from "./helper"

let cur: HTMLElement

export function cursor(el?: HTMLElement): HTMLElement {
  if (el) {
    cur = el
  }
  return cur
}

export const Hooks = Symbol("Hooks")
export const Mount = Symbol("Mount")
export const BeforeUpdate = Symbol("BeforeUpdate")
export const AfterUpdate = Symbol("AfterUpdate")
export const Destroy = Symbol("Destroy")
export const Events = Symbol("Events")
export const Styles = Symbol("Styles")
export const Directives = blank()
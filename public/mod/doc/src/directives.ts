import { Hooks, Destroy, Mount } from "./globals"
import { eachFn, sub } from "./helper"
import { useStyles } from "./styles"
import { T_BOOLEAN } from "./types"

export function lcAction(el: HTMLElement, type: any, fn: Subscription<HTMLElement>) {
  let fns: Subscription<any>[] = (el[Hooks][type]) || (el[Hooks][type] = [])
  return sub(fns, fn)
}

export function mountDirective(el: HTMLElement, prop: Subscription<HTMLElement>) {
  return lcAction(el, Mount, prop)
}

export function destroyDirective(el: HTMLElement, prop: Subscription<HTMLElement>) {
  return lcAction(el, Destroy, prop)
}

export function intervalDirective(el: HTMLElement, prop: [Subscription<HTMLElement>, number]) {
  let id = setInterval(() => prop[0](el), prop[1])
  return lcAction(el, Destroy, (): void => clearInterval(id))
}

export function referenceDirective(el: HTMLElement, prop: Reference<any>) {
  if (prop.isRef) prop.current = el
}

export function portalDirective(el: HTMLElement, prop: Portal<any>) {
  if (prop.isPortal) prop.set(el)
}

export function ifDirective(el: HTMLElement, prop: any) {
  if (typeof prop === T_BOOLEAN) {
    if (prop === false) el.setAttribute("hidden", "")
  }
  else if (prop.subscribe) {
    let state: Subscribable<boolean> = prop
    lcAction(el, Destroy, state.subscribe(val => {
      if (val === true) {
        el.removeAttribute("hidden")
      }
      else if (val === false) {
        el.setAttribute("hidden", "")
      }
    }))
  }
}

export function stylesDirective(el: HTMLElement, prop: any) {
  if (prop.subscribe) {
    let state: Subscribable<Partial<CSSStyleDeclaration>> = prop
    lcAction(el, Destroy, state.subscribe(rules => {
      useStyles(el, rules)
    }))
  }
  else {
    useStyles(el, prop)
  }
}

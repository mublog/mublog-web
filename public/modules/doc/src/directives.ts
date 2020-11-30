import { Hooks, BeforeUpdate, AfterUpdate } from "./globals"
import { eachFn } from "./helper"
import { onDestroy } from "./lifecycle"
import { useStyles } from "./styles"

export function referenceDirective(el: HTMLElement, prop: Reference<any>) {
  if (prop.isRef) prop.current = el
}

export function portalDirective(el: HTMLElement, prop: Portal<any>) {
  if (prop.isPortal) prop.set(el)
}

export function ifDirective(el: HTMLElement, property: boolean | Subscribable<boolean>) {
  if (typeof property === "boolean") {
    if (property === false) {
      el.setAttribute("hidden", "")
    }
  }
  else if (property.subscribe) {
    let state: Subscribable<boolean> = property
    onDestroy(state.subscribe(val => {
      if (val === true) {
        eachFn(el[Hooks][BeforeUpdate])
        el.removeAttribute("hidden")
        eachFn(el[Hooks][AfterUpdate])
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
    onDestroy(state.subscribe(rules => {
      eachFn(el[Hooks][BeforeUpdate])
      useStyles(el, rules)
      eachFn(el[Hooks][AfterUpdate])
    }))
  }
  else {
    useStyles(el, prop)
  }
}
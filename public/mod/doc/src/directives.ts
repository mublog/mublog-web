import { render } from "./children"
import { Destroy, Mount, Directives } from "./globals"
import { prepareForList, lifeCycle } from "./helper"
import { useStyles } from "./styles"
import { T_BOOLEAN } from "./types"

export function directive(name: string, fn: (el: HTMLElement, property: any) => any) {
  Directives[name] = fn
}

function mountDirective(el: HTMLElement, prop: Subscription<HTMLElement>) {
  return lifeCycle(el, Mount, prop)
}

function destroyDirective(el: HTMLElement, prop: Subscription<HTMLElement>) {
  return lifeCycle(el, Destroy, prop)
}

function intervalDirective(el: HTMLElement, prop: [Subscription<HTMLElement>, number]) {
  let id = setInterval(() => prop[0](el), prop[1])
  return lifeCycle(el, Destroy, (): void => clearInterval(id))
}

function referenceDirective(el: HTMLElement, prop: Reference<any>) {
  if (prop.isRef) prop.current = el
}

function portalDirective(el: HTMLElement, prop: Portal<any>) {
  if (prop.isPortal) prop.set(el)
}

function ifDirective(el: HTMLElement, prop: any) {
  if (typeof prop === T_BOOLEAN) {
    if (prop === false) el.setAttribute("hidden", "")
  }
  else if (prop.subscribe) {
    let state: Subscribable<boolean> = prop
    lifeCycle(el, Destroy, state.subscribe(val => {
      if (val === true) {
        el.removeAttribute("hidden")
      }
      else if (val === false) {
        el.setAttribute("hidden", "")
      }
    }))
  }
}

function stylesDirective(el: HTMLElement, prop: any) {
  if (prop.subscribe) {
    let state: Subscribable<Partial<CSSStyleDeclaration>> = prop
    lifeCycle(el, Destroy, state.subscribe(rules => useStyles(el, rules)))
  }
  else {
    useStyles(el, prop)
  }
}

function forDirective(el: HTMLElement, prop: DocDirectives["for"]) {
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
      destroyDirective(el, list.subscribe(val => {
        let copy = prepareForList(val, { sort, filter, limit, offset })
        render(el, ...copy.map(com))
      }))
    }
  }
}

directive("styles", stylesDirective)
directive("if", ifDirective)
directive("ref", referenceDirective)
directive("portal", portalDirective)
directive("mount", mountDirective)
directive("destroy", destroyDirective)
directive("interval", intervalDirective)
directive("for", forDirective)
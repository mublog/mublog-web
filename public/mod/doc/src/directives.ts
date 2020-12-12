import { render } from "./children"
import { Destroy, Mount, Directives } from "./globals"
import { prepareForList, lifeCycle } from "./helper"
import { useStyles } from "./styles"
import { T_BOOLEAN } from "./types"

export const directive = (name: string, fn: DirectiveFn) => Directives[name] = fn

const mountDirective: DirectiveFn = (e, p) => lifeCycle(e, Mount, p)
const destroyDirective: DirectiveFn = (e, p) => lifeCycle(e, Destroy, p)
const intervalDirective: DirectiveFn = (e, p: [Subscription<HTMLElement>, number]) => {
  let id = setInterval(() => p[0](e), p[1])
  return lifeCycle(e, Destroy, (): void => clearInterval(id))
}
const referenceDirective: DirectiveFn = (e: HTMLElement, p: Reference<any>) => {
  if (p.isRef) p.current = e
}
const portalDirective: DirectiveFn = (e: HTMLElement, p: Portal<any>) => {
  if (p.isPortal) p.set(e)
}
const ifDirective: DirectiveFn = (e, p) => {
  if (typeof p === T_BOOLEAN) {
    if (p === false) e.setAttribute("hidden", "")
  }
  else if (p.subscribe) {
    let state: Subscribable<boolean> = p
    lifeCycle(e, Destroy, state.subscribe(val => {
      val === true ? e.removeAttribute("hidden") : e.setAttribute("hidden", "")
    }))
  }
}
const stylesDirective: DirectiveFn = (e, p) => {
  if (p.subscribe) {
    let state: Subscribable<Partial<CSSStyleDeclaration>> = p
    lifeCycle(e, Destroy, state.subscribe(rules => useStyles(e, rules)))
  }
  else {
    useStyles(e, p)
  }
}
const forDirective: DirectiveFn = (e, p: DocDirectives["for"]) => {
  let sort: (a: any, b: any) => number = p.sort
  let filter: (value: any, index: number) => unknown = p.filter
  let limit: number = p.limit
  let offset: number = p.offset
  let com: HTMLComponent<any> = p.do
  if (p.of) {
    if (Array.isArray(p.of)) {
      let copy = prepareForList(p.of, { sort, filter, limit, offset })
      render(e, ...copy.map(com))
    }
    else if (p.of && p.of.subscribe) {
      let list: Subscribable<any[]> = p.of
      destroyDirective(e, list.subscribe(val => {
        let copy = prepareForList(val, { sort, filter, limit, offset })
        render(e, ...copy.map(com))
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
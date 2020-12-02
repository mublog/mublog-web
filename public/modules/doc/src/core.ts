import { Directives } from "./globals"
import { eachFn, addSubscription } from "./helper"

export function useState<Type>(initialValue: Type): State<Type> {
  let current = initialValue
  const isState = true
  const subscribers: Subscription<Type>[] = []
  const pub = { set, get, subscribe, isState, update }
  function set(newValue: Type) {
    if (newValue != current) {
      current = newValue
      eachFn(subscribers, current)
    }
    return pub
  }
  function update(fn: Update<Type>) {
    return set(fn(current))
  }
  function get(): Type {
    return current
  }
  function subscribe(fn: Subscription<Type>) {
    return addSubscription(subscribers, fn, () => fn(current))
  }
  return pub
}

export function useRef<Type>(): Reference<Type> {
  let current: Type
  const isRef = true
  const pub = { isRef, current }
  return pub
}

export function useDirective(name: string, fn: (el: HTMLElement, property: any) => any) {
  Directives[name] = fn
  return () => delete Directives[name]
}

export function usePortal<Type extends (...args: any[]) => Promise<HTMLElement> | HTMLElement>(component: Type): Portal<Type> {
  let anchor: HTMLElement
  let current: HTMLElement
  const isPortal = true
  const pub = { isPortal, open, close, set }
  async function open(props: Parameters<Type>[0], ...children: Child[]) {
    if (!current) {
      current = await component(props, ...children)
      anchor.appendChild(current)
    }
    else {
      close()
      open(props, ...children)
    }
  }
  function set(newAnchor: HTMLElement): Portal<Type> {
    anchor = newAnchor
    return pub
  }
  function close(): Portal<Type> {
    current.remove()
    current = undefined
    return pub
  }
  return pub
}
import { eachFn, sub } from "./helper"

export function observable<Type>(initialValue: Type): Observable<Type> {
  let current: Type = initialValue
  const subscribers: Subscription<Type>[] = []
  const pub = { isState: true, set, subscribe, update, value }
  function set(newValue: Type) {
    current = newValue
    eachFn(subscribers, current)
    return pub
  }
  function update(fn: Update<Type>) {
    fn(current)
    eachFn(subscribers, current)
    return pub
  }
  function value() {
    return current
  }
  function subscribe(fn: Subscription<Type>) {
    fn(current)
    return sub(subscribers, fn)
  }
  return pub
}

export function reference<Type>(): Reference<Type> {
  let current: Type
  const pub = { isRef: true, current }
  return pub
}

export function portal<Type extends (...args: any[]) => Promise<HTMLElement> | HTMLElement>(component: Type): Portal<Type> {
  let anchor: HTMLElement
  let current: HTMLElement
  const openObservers = []
  const closeObservers = []
  const pub = { isPortal: true, open, close, set, onOpen, onClose }
  async function open(props: Parameters<Type>[0], ...children: Child[]) {
    if (!current) {
      current = await component(props, ...children)
      anchor.appendChild(current)
      eachFn(openObservers)
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
    if (current) {
      current.remove()
      current = undefined
      eachFn(closeObservers)
    }
    return pub
  }
  function onOpen(fn: () => any) {
    openObservers.push(fn)
    return pub
  }
  function onClose(fn: () => any) {
    closeObservers.push(fn)
    return pub
  }
  return pub
}
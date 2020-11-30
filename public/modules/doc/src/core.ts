import { Directives } from "./globals"
import { eachFn, addSubscription } from "./helper"

export function useState<Type>(initialValue: Type): State<Type> {
  let current = initialValue
  const isState = true
  const subscribers: Subscription<Type>[] = []
  const pub = { set, get, subscribe, isState, update }
  function set(newValue: Type) {
    if (newValue !== current) {
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
  let current = undefined
  const isRef = true
  const pub = { isRef, current }
  return pub
}

export function useStore<Type extends StoreItem>(data?: Type[]): Store<Type> {
  let local: Type[] = data || []
  const isStore = true
  const subscribers: ((items: Type[]) => any)[] = []
  const pub = { get, add, del, subscribe, clear, size, each, isStore, notify }
  function size() {
    return local.length
  }
  function notify() {
    eachFn(subscribers, local)
    return pub
  }
  function clear() {
    local.length = 0
    notify()
    return pub
  }
  function each(fn: StorePredicate<Type>) {
    let i = 0
    let len = size()
    for (i; i < len; i++) {
      fn(local[i], i)
    }
    return pub
  }
  function get(): Type[] {
    return local
  }
  function add(item: Type) {
    local.push(item)
    notify()
    return pub
  }
  function del(fn: StorePredicate<Type>) {
    let idx = local.findIndex(fn)
    if (idx >= 0) {
      local.splice(idx, 1)
      notify()
    }
    return pub
  }
  function subscribe(fn: (items: Type[]) => void) {
    return addSubscription(subscribers, fn, () => fn(local))
  }
  return pub
}

export function useDirective(name: string, fn: (property: any) => any) {
  Directives[name] = fn
}

export function usePortal<Type extends (...args: any[]) => Promise<HTMLElement> | HTMLElement>(component: Type): Portal<Type> {
  let isSet: boolean = false
  let anchor: HTMLElement
  let current: any
  const isPortal = true
  const pub = { isPortal, open, close, set }
  async function open(props: Parameters<Type>[0], ...children: Child[]) {
    if (!isSet) {
      isSet = true
      current = await component(props, ...children)
      anchor.appendChild(current)
    }
    else {
      close()
      open(props, ...children)
    }
    return current
  }
  function set(newAnchor: HTMLElement): Portal<Type> {
    anchor = newAnchor
    return pub
  }
  function close(): Portal<Type> {
    current.remove()
    current = undefined
    isSet = false
    return pub
  }
  return pub
}
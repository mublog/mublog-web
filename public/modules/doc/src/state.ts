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
import { eachFn } from "./helper"

export function useState<Type>(initialValue: Type): State<Type> {
  let current = initialValue
  const subscribers: Subscription<Type>[] = []
  const pub = { set, get, subscribe, isState, update }
  function isState() {
    return true
  }
  function notify() {
    eachFn(subscribers, current)
    return pub
  }
  function set(newValue: Type) {
    current = newValue
    notify()
    return pub
  }
  function update(fn: Update<Type>) {
    return set(fn(current))
  }
  function get(): Type {
    return current
  }
  function subscribe(fn: Subscription<Type>) {
    subscribers.push(fn)
    fn(current)
    return function unsubscribe() {
      const index = subscribers.indexOf(fn)
      if (index !== -1) {
        subscribers.splice(index, 1)
      }
    }
  }
  notify()
  return pub
}
import { eachFn } from "./helper"

export function useRef<Type>(): Reference<Type> {
  let current = undefined
  const subscribers = []
  const pub = { get, set, isRef, subscribe }
  function get() {
    return current
  }
  function set(newValue: Type) {
    current = newValue
    notify()
    return pub
  }
  function notify() {
    eachFn(subscribers, current)
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
  function isRef() {
    return true
  }
  return pub
}
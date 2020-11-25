export function useRef<Type>(): Reference<Type> {
  let value = undefined
  const subscribers = []
  const pub = { get, set, isRef, subscribe }
  function get() {
    return value
  }
  function set(newValue: Type) {
    value = newValue
    notify()
    return pub
  }
  function notify() {
    subscribers.forEach(sub => sub(value))
  }
  function subscribe(fn: Subscription<Type>) {
    subscribers.push(fn)
    fn(value)
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
export function useState<Type>(initialValue: Type): State<Type> {
  let value = initialValue
  const subscribers: Subscription<Type>[] = []
  const pub = { set, get, subscribe, isState, update }
  function isState() {
    return true
  }
  function notify() {
    subscribers.forEach(sub => sub(value))
    return pub
  }
  function set(newValue: Type) {
    value = newValue
    notify()
    return pub
  }
  function update(fn: Update<Type>) {
    return set(fn(value))
  }
  function get(): Type {
    return value
  }
  function subscribe(fn: Subscription<Type>) {
    subscribers.push(fn)
    notify()
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
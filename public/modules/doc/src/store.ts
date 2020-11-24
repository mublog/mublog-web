export function useStore<Type extends StoreItem>(data?: Type[]): Store<Type> {
  let local: Type[] = data || []
  const changeFns: ((items: Type[]) => any)[] = []
  const pub = { get, add, del, subscribe, clear, size, each, isStore, find, filter, updateOne }
  function isStore() {
    return true
  }
  function size() {
    return local.length
  }
  function updateOne(fn: StorePredicate<Type>, up: StoreUpdate<Type>) {
    let find = local.find(fn)
    if (find) {
      find = up(find)
      return true
    }
    return false
  }
  function notify() {
    changeFns.forEach(fn => fn(local))
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
  function find(fn: StorePredicate<Type>) {
    return local.find(fn)
  }
  function filter(fn: StorePredicate<Type>) {
    return local.filter(fn)
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
    changeFns.push(fn)
    notify()
    return function () {
      let index = changeFns.indexOf(fn)
      if (index >= 0) {
        changeFns.splice(index, 1)
      }
    }
  }
  return pub
}
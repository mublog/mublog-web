export function usePortal<Type extends (...args: any[]) => HTMLElement>(component: Type): Portal<Type> {
  let isSet: boolean = false
  let anchor: HTMLElement
  let current: any
  const isPortal = true
  const pub = { isPortal, open, close, set }
  function open(arg: Parameters<Type>[0]) {
    if (!isSet) {
      current = component(arg)
      anchor.appendChild(current)
    }
    else {
      close()
      open(arg)
    }
    return current
  }
  function set(newAnchor: HTMLElement): Portal<Type> {
    anchor = newAnchor
    return pub
  }
  function close(): Portal<Type> {
    if (isSet) {
      current.remove()
      current = undefined
      isSet = false
    }
    return pub
  }
  return pub
}
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
import { Hooks } from "./symbols"
import { onDestroy } from "./lifecycle"
import { cursor } from "./element"

export function onGlobalEvent<Name extends EventNames>(name: Name, fn: (event: EventMap[Name]) => any) {
  if (!window[Hooks]) {
    window[Hooks] = Object.create(null)
  }
  let fns = ((window[Hooks][name]) || (window[Hooks][name] = [])) as any[]
  let event = (ev: any) => fns.forEach((cb: (arg: any) => any) => cb(ev))
  fns.push(fn)
  if (fns.length === 1) {
    addEventListener(name, event, false)
  }
  return function () {
    const index = fns.indexOf(fn)
    if (index !== -1) {
      fns.splice(index, 1)
      if (fns.length === 0) {
        removeEventListener(name, event, false)
      }
    }
  }
}

export function onEvent<Name extends EventNames>(name: Name, fn: (event: EventMap[Name]) => any) {
  let el = cursor()
  let fns = ((el[Hooks][name]) || (el[Hooks][name] = [])) as any[]
  let event = (ev: any) => fns.forEach((cb: (arg: any) => any) => cb(ev))
  fns.push(fn)
  if (fns.length === 1) {
    el.addEventListener(name, event, false)
  }
  onDestroy(() => {
    const index = fns.indexOf(fn)
    if (index !== -1) {
      fns.splice(index, 1)
      if (fns.length === 0) {
        el.removeEventListener(name, event, false)
      }
    }
  })
}

export function onClick(fn: (event: MouseEvent) => any) {
  return onEvent("click", fn)
}

export function onDoubleClick(fn: (event: MouseEvent) => any) {
  return onEvent("dblclick", fn)
}

export function onSubmit(fn: (event: Event) => any) {
  return onEvent("submit", fn)
}

export function onBlur(fn: (event: FocusEvent) => any) {
  return onEvent("blur", fn)
}

export function onChange(fn: (event: Event) => any) {
  return onEvent("change", fn)
}

export function onContextMenu(fn: (event: MouseEvent) => any) {
  return onEvent("contextmenu", fn)
}

export function onFocus(fn: (event: FocusEvent) => any) {
  return onEvent("focus", fn)
}

export function onInput(fn: (event: Event) => any) {
  return onEvent("input", fn)
}

export function onInvalid(fn: (event: Event) => any) {
  return onEvent("invalid", fn)
}

export function onReset(fn: (event: Event) => any) {
  return onEvent("reset", fn)
}

export function onSelect(fn: (event: Event) => any) {
  return onEvent("select", fn)
}

export function onKeyDown(fn: (event: KeyboardEvent) => any) {
  return onEvent("keydown", fn)
}

export function onKeyPress(fn: (event: KeyboardEvent) => any) {
  return onEvent("keypress", fn)
}

export function onKeyUp(fn: (event: KeyboardEvent) => any) {
  return onEvent("keyup", fn)
}

export function onMouseDown(fn: (event: MouseEvent) => any) {
  return onEvent("mousedown", fn)
}

export function onMouseMove(fn: (event: MouseEvent) => any) {
  return onEvent("mousemove", fn)
}

export function onMouseOut(fn: (event: MouseEvent) => any) {
  return onEvent("mouseout", fn)
}

export function onMouseOver(fn: (event: MouseEvent) => any) {
  return onEvent("mouseover", fn)
}

export function onMouseUp(fn: (event: MouseEvent) => any) {
  return onEvent("mouseup", fn)
}

export function onWheel(fn: (event: WheelEvent) => any) {
  return onEvent("wheel", fn)
}
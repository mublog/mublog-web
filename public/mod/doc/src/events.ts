import { Hooks, Events, cursor } from "./globals"
import { onDestroy } from "./lifecycle"
import { blank, eachFn } from "./helper"

export function onGlobalEvent<Name extends EventNames>(name: Name, fn: (event: EventMap[Name]) => any) {
  if (!window[Hooks]) {
    window[Hooks] = blank()
    if (!window[Hooks][Events]) window[Hooks][Events] = blank()
  }
  let fns = ((window[Hooks][Events][name]) || (window[Hooks][Events][name] = [])) as any[]
  let event = (ev: any) => eachFn(fns, ev)
  fns.push(fn)
  if (fns.length === 1) listen(window, name, event)
  return () => {
    const index = fns.indexOf(fn)
    if (index !== -1) {
      fns.splice(index, 1)
      if (fns.length === 0) unlisten(window, name, event)
    }
  }
}

export function onEvent<Name extends EventNames>(name: Name, fn: (event: EventMap[Name]) => any) {
  let el = cursor()
  let fns = ((el[Hooks][Events][name]) || (el[Hooks][Events][name] = [])) as any[]
  let event = (ev: any) => eachFn(fns, ev)
  fns.push(fn)
  if (fns.length === 1) listen(el, name, event)
  onDestroy(() => {
    const index = fns.indexOf(fn)
    if (index !== -1) {
      fns.splice(index, 1)
      if (fns.length === 0) unlisten(el, name, event)
    }
  })
}

function listen(target: HTMLElement | Window, name: string, listener: (event: any) => any) {
  target.addEventListener(name, listener, false)
}

function unlisten(target: HTMLElement | Window, name: string, listener: (event: any) => any) {
  target.removeEventListener(name, listener, false)
}
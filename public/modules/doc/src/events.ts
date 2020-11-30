import { Hooks, Events, cursor } from "./globals"
import { onDestroy } from "./lifecycle"
import { blank, eachFn } from "./helper"

export function onGlobalEvent<Name extends EventNames>(name: Name, fn: (event: EventMap[Name]) => any) {
  if (!window[Hooks]) {
    window[Hooks] = blank()
    if (!window[Hooks][Events]) {
      window[Hooks][Events] = blank()
    }
  }
  let fns = ((window[Hooks][Events][name]) || (window[Hooks][Events][name] = [])) as any[]
  let event = (ev: any) => eachFn(fns, ev)
  fns.push(fn)
  if (fns.length === 1) {
    addEventListener(name, event, false)
  }
  return () => {
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
  let fns = ((el[Hooks][Events][name]) || (el[Hooks][Events][name] = [])) as any[]
  let event = (ev: any) => eachFn(fns, ev)
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
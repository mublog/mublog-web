import { onEvent } from "./events"
import { Destroy, Directives } from "./globals"
import { keysOf, lifeCycle } from "./helper"
import { T_FUNCTION } from "./types"

export function setProperties(el: HTMLElement, props: any) {
  const keys = keysOf(props)
  keys.forEach(key => {
    const dir = Directives[key]
    dir ? dir(el, props[key]) : writeDefault(el, key, props[key])
  })
}

function writeDefault(el: HTMLElement, key: string, property: any) {
  if (property === undefined) return
  if (property.subscribe) {
    let state: Subscribable<any> = property
    el[key] = state.value()
    lifeCycle(el, Destroy, state.subscribe(val => {
      if (el[key] !== val) el[key] = val
    }))
  }
  else if (key.startsWith("on") && typeof property === T_FUNCTION) {
    onEvent(el, key.slice(2) as EventNames, property)
  }
  else {
    el[key] = property
  }
}
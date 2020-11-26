import { Hooks, Mount, AfterUpdate, BeforeUpdate, Destroy } from "./symbols"
import { cursor } from "./element"

function onAction(type: any, fn: (...args: any[]) => any) {
  const el = cursor()
  let fns = (el[Hooks][type]) || (el[Hooks][type] = []) as any[]
  el && fns.push(fn)
  function removeAction() {
    const index = fns.indexOf(fn)
    if (index !== -1) {
      fns.splice(index, 1)
    }
  }
  return removeAction
}

export function beforeUpdate(fn: () => any): void {
  onAction(BeforeUpdate, fn)
}

export function afterUpdate(fn: () => any): void {
  onAction(AfterUpdate, fn)
}

export function onMount(fn: () => any): void {
  onAction(Mount, fn)
}

export function onDestroy(fn: () => any): void {
  onAction(Destroy, fn)
}

export function onInterval(fn: IntervalFn, interval: number = 0) {
  let id = setInterval(fn, interval)
  onDestroy((): void => clearInterval(id))
}
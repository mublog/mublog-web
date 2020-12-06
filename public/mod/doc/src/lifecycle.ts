import { Hooks, Mount, AfterUpdate, BeforeUpdate, Destroy, cursor } from "./globals"
import { sub } from "./helper"

function onAction(type: any, fn: (...args: any[]) => any) {
  const el = cursor()
  let fns = (el[Hooks][type]) || (el[Hooks][type] = []) as any[]
  return sub(fns, fn)
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
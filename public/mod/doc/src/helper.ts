import { Hooks } from "./globals"
import { T_NUMBER } from "./types"

export function each(list: any[], fn?: (val: any, idx?: number, list?: any[]) => any) {
  if (!list || list.length === 0) return
  let i = 0
  const len = list.length
  for (i; i < len; i++) fn(list[i])
}

export function eachFn(list: ((...args: any[]) => any)[], ...args: any[]) {
  if (!list || list.length === 0) return
  let i = 0
  const len = list.length
  for (i; i < len; i++) list[i](...args)
}

export function blank() {
  return Object.create(null)
}

export function sub(subscribers: Subscription<any>[], fn: Subscription<any>) {
  subscribers.push(fn)
  return () => unsub(subscribers, fn)
}

function unsub(subscribers: Subscription<any>[], fn: Subscription<any>) {
  const index = subscribers.indexOf(fn)
  if (index !== -1) subscribers.splice(index, 1)
}

export function createKey(): string {
  return Date.now().toString(36) + "-" + (Math.round(Math.random() * 100000)).toString(36)
}

export function createHash(input: string): string {
  let h: number
  for (let i = 0, length = input.length; i < length; i++) h = Math.imul(31, h) + input.charCodeAt(i) | 0
  return h.toString(36)
}

export function prepareForList(list: any[], { sort, filter, limit, offset }) {
  let copy = [...list]
  if (filter) copy = copy.filter(filter)
  if (sort) copy = copy.sort(sort)
  if (typeof offset === T_NUMBER) copy = copy.slice(0, offset)
  if (typeof limit === T_NUMBER) copy.length = limit
  return copy
}

export function keysOf(obj: any) {
  let keys: string[] = []
  for (let key in obj) keys.push(key)
  return keys
}

export function lifeCycle(el: HTMLElement, type: any, fn: Subscription<HTMLElement>) {
  let fns: Subscription<any>[] = (el[Hooks][type]) || (el[Hooks][type] = [])
  return sub(fns, fn)
}
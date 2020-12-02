export function each(list: any[], fn?: (val: any, idx?: number, list?: any[]) => any) {
  if (!list || list.length === 0) return
  let i = 0
  const len = list.length
  for (i; i < len; i++) {
    fn(list[i])
  }
}

export function eachFn(list: ((...args: any[]) => any)[], ...args: any[]) {
  if (!list || list.length === 0) return
  let i = 0
  const len = list.length
  for (i; i < len; i++) {
    list[i](...args)
  }
}

export function blank() {
  return Object.create(null)
}

export function addSubscription(subscribers: Subscription<any>[], fn: Subscription<any>, cb?: (...args: any[]) => any) {
  subscribers.push(fn)
  if (cb) {
    cb()
  }
  return function unsubscribe() {
    const index = subscribers.indexOf(fn)
    if (index !== -1) {
      subscribers.splice(index, 1)
    }
  }
}

export function createKey(): string {
  return Date.now().toString(36) + "-" + (Math.round(Math.random() * 100000)).toString(36)
}

export function createHash(input: string): string {
  let h: number
  for (let i = 0, length = input.length; i < length; i++) {
    h = Math.imul(31, h) + input.charCodeAt(i) | 0
  }
  return h.toString(36)
}

export function prepareForList(list: any[], { sort, filter, limit, offset }) {
  let copy = [...list]
  if (filter) copy = copy.filter(filter)
  if (sort) copy = copy.sort(sort)
  if (typeof offset === "number") copy = copy.slice(0, offset)
  if (typeof limit === "number") copy.length = limit
  return copy
}

export function pipe(...fns: ((...args: any[]) => any)[]) {
  return (...args: any[]) => fns.reduce((args, f) => [f.apply(this, args)], args)[0]
}

export function keysOf(obj: any) {
  let keys: string[] = []
  for (let key in obj) keys.push(key)
  return keys
}
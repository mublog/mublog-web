export function each(list: any[], fn?: (val: any, idx?: number, list?: any[]) => any) {
  if (!list || list.length === 0) return
  let i = 0
  const len = list.length
  for (i; i < len; i++) {
    fn(list[i])
  }
}

export function eachFn(list: any[], ...args: any[]) {
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
  let i = 0
  const length = input.length
  for (i; i < length; i++) {
    h = Math.imul(31, h) + input.charCodeAt(i) | 0
  }
  return h.toString(36)
}
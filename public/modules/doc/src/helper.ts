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
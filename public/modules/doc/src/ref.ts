export function useRef<Type>(): Reference<Type> {
  let current = undefined
  const isRef = true
  const pub = { isRef, current }
  return pub
}
export default function hash(input: string): string {
  let h: number
  let i = 0
  const length = input.length
  for (i; i < length; i++) {
    h = Math.imul(31, h) + input.charCodeAt(i) | 0
  }
  return h.toString(36)
}
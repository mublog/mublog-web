export function createKey(): string {
  return Date.now().toString(36) + "-" + (Math.round(Math.random() * 100000)).toString(36)
}
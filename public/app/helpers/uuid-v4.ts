const UUID_V4_TEMPLATE = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"

export function UUIDv4(): string {
  return UUID_V4_TEMPLATE.replace(/[xy]/g, c => {
    let r = Math.random() * 16 | 0
    let v = c === "x" ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
export async function base64ToBlob(base64Image: string): Promise<[Blob, Error]> {
  try {
    const parts = base64Image.split(";base64,")
    const type = parts[0].split(":")[1]
    const data = atob(parts[1])
    const length = data.length
    const uInt8Array = new Uint8Array(length)
    for (let i = 0; i < length; ++i) uInt8Array[i] = data.charCodeAt(i)
    return [new Blob([uInt8Array], { type }), null]
  }
  catch (error) {
    return [null, error]
  }
}
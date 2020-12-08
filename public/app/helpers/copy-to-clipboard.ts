export default async function copyToClipboard(content: string): Promise<Error> {
  let textArea = document.createElement("textarea")
  let error: Error
  try {
    document.body.appendChild(textArea)
    textArea.value = content
    textArea.select()
    textArea.setSelectionRange(0, content.length)
    document.execCommand("copy")
  }
  catch (err) {
    error = err
  }
  finally {
    textArea.remove()
    return error
  }
}
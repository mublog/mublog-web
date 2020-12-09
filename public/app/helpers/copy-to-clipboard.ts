const TextArea = document.createElement("textarea")
document.body.appendChild(TextArea)
hide()

export default async function copyToClipboard(content: string): Promise<Error> {
  let error: Error
  try {
    TextArea.value = content
    show()
    copy()
  }
  catch (err) {
    error = err
  }
  finally {
    hide()
    return error
  }
}

function copy() {
  TextArea.select()
  TextArea.setSelectionRange(0, TextArea.value.length)
  document.execCommand("copy")
}

function hide() {
  TextArea.setAttribute("hidden", "true")
}

function show() {
  TextArea.removeAttribute("hidden")
}
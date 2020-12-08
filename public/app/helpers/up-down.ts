interface DownOption {
  filename: string
  contentType: string
}

interface UpOption {
  accept: string
  readAs: "BinaryString" | "Text" | "DataURL"
}

interface File<Type> {
  data: Type
  name: string
  lastModified: number
  webkitRelativePath: string
  size: number
  type: string
}

export function down(content: string, option: DownOption): Error {
  try {
    let type = option.contentType || "application/octet-stream"
    let a = document.createElement("a")
    a.href = URL.createObjectURL(new Blob([content], { type }))
    a.download = option.filename
    a.click()
    return null
  }
  catch (error) {
    return error
  }
}

export function up<Type = string>(option: UpOption): Promise<[File<Type>, Error]> {
  return new Promise(res => {
    try {
      let input = document.createElement("input")
      input.accept = option.accept
      input.type = "file"
      input.onchange = (event: any) => {
        let files = event.target.files
        if (!files.length) return res([null, null])
        let file: File<Type> = files[0]
        let reader = new FileReader()
        reader.onload = (event) => {
          file.data = event.target.result as unknown as Type
          res([file, null])
        }
        reader.onerror = () => res([null, null])
        reader.onabort = () => res([null, null])
        reader["readAs" + option.readAs](file)
      }
      input.click()
    }
    catch (error) {
      res([null, error])
    }
  })
}
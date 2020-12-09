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

const DownloadElement = document.createElement("a")
export function down(content: string, option: DownOption): Error {
  try {
    let type = option.contentType || "application/octet-stream"
    DownloadElement.href = URL.createObjectURL(new Blob([content], { type }))
    DownloadElement.download = option.filename
    DownloadElement.click()
    return null
  }
  catch (error) {
    return error
  }
}

const Reader = new FileReader()
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
        Reader.onload = (event) => {
          file.data = event.target.result as unknown as Type
          res([file, null])
        }
        Reader.onerror = () => res([null, null])
        Reader.onabort = () => res([null, null])
        Reader["readAs" + option.readAs](file)
      }
      input.click()
    }
    catch (error) {
      res([null, error])
    }
  })
}
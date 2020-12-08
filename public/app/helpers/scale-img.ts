interface ScaleOptions {
  width: number
  height: number
  smooth: boolean
}

export function scaleImage(imageSource: string, options: Partial<ScaleOptions>): Promise<[string, Error]> {
  if (!options) options = {}
  if (!options.smooth) options.smooth = true
  return new Promise(res => {
    try {
      let img = new Image()
      let canvas = document.createElement("canvas")
      let ctx = canvas.getContext("2d")
      img.src = imageSource
      img.onload = () => {
        ctx.drawImage(img, 0, 0)
        let width = img.width
        let height = img.height
        if (!options.width) options.width = width
        if (!options.height) options.height = height
        if (width > height) {
          height *= options.width / width
          width = options.width
        }
        else {
          width *= options.height / height
          height = options.height
        }
        canvas.width = width
        canvas.height = height
        ctx = canvas.getContext("2d")
        ctx.imageSmoothingEnabled = options.smooth
        ctx.drawImage(img, 0, 0, width, height)
        res([canvas.toDataURL("image/png"), null])
      }
      img.onerror = (event, source, lineno, colno, error) => res([null, error])
    }
    catch (error) {
      res([null, error])
    }
  })
}
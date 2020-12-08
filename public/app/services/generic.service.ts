import { useState } from "../../mod/doc/mod"

export const isLoading = useState(false)

export function activateRoute(href: string) {
  history.pushState(null, "", href)
  return dispatchEvent(new PopStateEvent("popstate"))
}

export const Uploaded = useState(false)
export const Uploads = useState<UploadItem<string>[]>([])

Uploads.subscribe(images => Uploaded.set(images.length > 0 ? true : false))
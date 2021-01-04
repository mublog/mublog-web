import { observable } from "../../mod/doc/mod"

export const isLoading = observable(false)

export function activateRoute(href: string) {
  history.pushState(null, "", href)
  return dispatchEvent(new PopStateEvent("popstate"))
}

export const Uploaded = observable(false)
export const Uploads = observable<UploadItem[]>([])

Uploads.subscribe(images => Uploaded.set(images.length > 0 ? true : false))
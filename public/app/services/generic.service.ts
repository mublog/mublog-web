import { useState } from "../../mod/doc/mod"

export const isLoading = useState(false)

export function activateRoute(href: string) {
  history.pushState(null, "", href)
  return dispatchEvent(new PopStateEvent("popstate"))
}
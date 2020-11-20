export function activateRoute(href: string) {
    history.pushState(null, "", href)
    dispatchEvent(new PopStateEvent("popstate"))
}
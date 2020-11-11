// @ts-check

/**
 * @template tag, props
 * @param {import("../../choc").default<tag, props>} targetComponent 
 * @param {import("./types").LoadedRoute} route
 * @param {string} url
 */
export default async function renderRoute(targetComponent, route, url) {
    if (route.title) {
        document.title = route.title
    }
    history.replaceState(route.params, document.title, url)
    targetComponent.nativeElement.innerHTML = ""
    targetComponent.append(route.component)
}
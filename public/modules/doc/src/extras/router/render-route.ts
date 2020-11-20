import type { LoadedRoute } from "./types"

export default async function renderRoute<Target extends Element>(
    targetComponent: Target, 
    route: LoadedRoute,
    url: string
) {
    if (route.title) {
        document.title = route.title
    }
    history.replaceState(route.params, document.title, url)
    targetComponent.innerHTML = ""
    targetComponent.append(route.component)
}
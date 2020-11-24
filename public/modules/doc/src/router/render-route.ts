import { render } from "../element"

export default async function renderRoute<Target extends HTMLElement>(
    targetComponent: Target,
    route: LoadedRoute,
    url: string
) {
    if (route.title) {
        document.title = route.title
    }
    history.replaceState(route.params, document.title, url)
    render(targetComponent, route.component)
}
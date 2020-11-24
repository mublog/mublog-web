import findRoute from "./find-route"

export default async function loadRoute(routes: Route[], url: string): Promise<LoadedRoute> {
    let route = await findRoute(routes, url)
    if (!route) {
        return
    }
    let { component, title, params } = route
    let stateTitle = ""
    if (title) {
        if (typeof title === "function") {
            stateTitle = title(params)
        }
        else if (typeof title === "string") {
            stateTitle = title
        }
    }
    let stateComponent = await component(params)
    return {
        title: stateTitle,
        params,
        component: stateComponent
    }
}
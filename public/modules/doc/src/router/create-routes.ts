import createMatcher from "./create-matcher"

export default function createRoutes(routes: RouteConstructor[]): Route[] {
    let routesArray: Route[] = []
    let i = 0
    while (routes[i]) {
        let { component, path, title, children, activates } = routes[i]
        let matcher = createMatcher(path)
        activates = [...new Set(activates)]
        routesArray.push({ title, matcher, component, activates })
        if (children) {
            routes.splice(i + 1, 0, ...children.map(rc => {
                if (rc.activates && activates) {
                    rc.activates = [...activates, ...new Set(rc.activates)]
                }
                else if (activates) {
                    rc.activates = activates
                }
                rc.path = path + "/" + rc.path
                return rc
            }))
        }
        i++
    }
    return routesArray
}
import executeActivators from "./execute-activators"
import parameters from "./parameters"

export default async function findRoute(routes: Route[], url: string): Promise<Route> {
  let i = 0
  while (routes[i]) {
    let route = routes[i]
    if (!route.matcher.test(url)) {
      i++
      continue
    }
    route.params = parameters(route.matcher, url)
    let activatable = await executeActivators(route.activates, route.params)
    if (activatable) return route
    i++
    continue
  }
}
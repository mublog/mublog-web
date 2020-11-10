// @ts-check
import executeActivators from "./execute-activators.js"
import parameters from "./parameters.js"

/**
 * @param {import("./types").Route[]} routes 
 * @param {string} url
 */
export default async function findRoute(routes, url) {
    let i = 0
    while (routes[i]) {
        let route = routes[i]
        if (!route.matcher.test(url)) {
            i++
            continue
        }
        route.params = parameters(route.matcher, url)
        let activatable = await executeActivators(route.activates, route.params)
        if (activatable) {
            return route
        }
        i++
        continue
    }
}
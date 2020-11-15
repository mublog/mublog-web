// @ts-check

import findRoute from "./find-route.js"

/**
 * @param {import("./types").Route[]} routes
 * @param {string} url
 * @returns {Promise<import("./types").LoadedRoute>}
 */
export default async function loadRoute(routes, url) {
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
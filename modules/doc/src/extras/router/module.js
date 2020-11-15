// @ts-check
import useMixin from "../../helpers/mixin.js"
import { useEvent } from "../../helpers/events.js"
import createRoutes from "./create-routes.js"
import loadRoute from "./load-route.js"
import renderRoute from "./render-route.js"
import url from "./url.js"

/**
 * @template component
 * @param {component & HTMLElement} routerComponent 
 * @param {import("./types").RouteConstructor[]} routes
 */
export default function createRouter(routerComponent, routes) {
    const Routes = createRoutes(routes)
    const callbacks = {
        load: [],
        loadEnd: [],
        loadError: []
    }

    async function listener() {
        let loadUrl = url()
        callbacks.load.forEach(cb => cb())
        let route = await loadRoute(Routes, loadUrl)
        if (route) {
            renderRoute(routerComponent, route, loadUrl)
        }
        else {
            callbacks.loadError.forEach(cb => cb())
        }
        callbacks.loadEnd.forEach(cb => cb())
    }

    listener()

    useEvent(window, "popstate", listener)

    return useMixin(routerComponent, {
        /** @param {() => any} callback */
        onLoad(callback) {
            callbacks.load.push(callback)
        },
        /** @param {() => any} callback */
        onLoadEnd(callback) {
            callbacks.loadEnd.push(callback)
        },
        /** @param {() => any} callback */
        onLoadError(callback) {
            callbacks.loadError.push(callback)
        }
    })
}

/**
 * @param {Event} event 
 */
function routeListener(event) {
    let target = event.target
    while (target) {
        if (target["href"]) {
            event.preventDefault()
            history.pushState(null, "", target["href"])
            dispatchEvent(new PopStateEvent("popstate"))
            break
        }
        target = target["parentNode"]
    }
}

useEvent(window, "click", routeListener)
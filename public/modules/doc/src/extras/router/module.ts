import type { Route, RouteConstructor } from "./types"
import useMixin from "../../helpers/mixin"
import { useEvent } from "../../helpers/events"
import createRoutes from "./create-routes"
import loadRoute from "./load-route"
import renderRoute from "./render-route"
import url from "./url"

export default function createRouter<Target extends Element>(
    routerComponent: Target,
    routes: RouteConstructor[]
) {
    const Routes: Route[] = createRoutes(routes)
    const callbacks: { [key: string]: (() => any)[]} = {
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
    // @ts-expect-error
    useEvent(window, "popstate", listener)

    return useMixin(routerComponent, {
        onLoad(callback: () => any) {
            callbacks.load.push(callback)
        },
        onLoadEnd(callback: () => any) {
            callbacks.loadEnd.push(callback)
        },
        onLoadError(callback: () => any) {
            callbacks.loadError.push(callback)
        }
    })
}

function routeListener(event: Event) {
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
// @ts-check
import createRoutes from "./create-routes.js"
import loadRoute from "./load-route.js"
import renderRoute from "./render-route.js"
import url from "./url.js"

const popStateEvent = new PopStateEvent("popstate")

/**
 * @template component
 * @param {component & import("../../choc").default} routerComponent 
 * @param {import("./types").RouteConstructor[]} routes
 */
export default function chocRouter(routerComponent, routes) {
    const Routes = createRoutes(routes)
    let loadCallback = undefined
    let loadEndCallback = undefined
    let loadErrorCallback = undefined
    async function listener() {
        let loadUrl = url()
        if (loadCallback) {
            loadCallback()
        }
        let route = await loadRoute(Routes, loadUrl)
        if (route) {
            renderRoute(routerComponent, route, loadUrl)
        }
        else {
            if (loadErrorCallback) {
                loadErrorCallback()
            }
        }
        if (loadEndCallback) {
            loadEndCallback()
        }
    }
    listener()
    addEventListener("popstate", listener, false)
    return routerComponent.mixin({
        /** @param {() => any} callback */
        onLoad(callback) {
            loadCallback = callback
        },
        /** @param {() => any} callback */
        onLoadEnd(callback) {
            loadEndCallback = callback
        },
        /** @param {() => any} callback */
        onLoadError(callback) {
            loadErrorCallback = callback
        },
        /** @param {string} href */
        activateRoute(href) {
            history.pushState(null, "", href)
            dispatchEvent(popStateEvent)
        },
        /**
         * @template component
         * @param {component & import("../../choc").default} component 
         */
        createRoute(component) {
            component.addEvent("click", (node, event) => {
                let href = component.nativeElement.href
                event.preventDefault()
                if (href) {
                    history.pushState(null, "", href)
                    dispatchEvent(popStateEvent)
                }
            })
        }
    })
}
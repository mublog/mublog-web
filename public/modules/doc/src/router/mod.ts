import { onGlobalEvent } from "../events"
import { eachFn } from "../helper"
import createRoutes from "./create-routes"
import loadRoute from "./load-route"
import renderRoute from "./render-route"
import url from "./url"

export function useRouter<Target extends HTMLElement>({ target, routes }: { target: Target, routes: RouteConstructor[] }) {
  const Routes: Route[] = createRoutes(routes)
  const callbacks: { [key: string]: (() => any)[] } = {
    load: [],
    loadEnd: [],
    loadError: []
  }
  const pub = { onLoad, onLoadEnd, onLoadError }

  async function listener() {
    let loadUrl = url()
    eachFn(callbacks.load)
    let route = await loadRoute(Routes, loadUrl)
    if (route) {
      renderRoute(target, route, loadUrl)
    }
    else {
      eachFn(callbacks.loadError)
    }
    eachFn(callbacks.loadEnd)
  }

  function onLoad(fn: () => any) {
    callbacks.load.push(fn)
    return pub
  }

  function onLoadEnd(fn: () => any) {
    callbacks.loadEnd.push(fn)
    return pub
  }

  function onLoadError(fn: () => any) {
    callbacks.loadEnd.push(fn)
    return pub
  }

  listener()
  onGlobalEvent("popstate", listener)
  return pub
}

onGlobalEvent("click", (event) => {
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
})
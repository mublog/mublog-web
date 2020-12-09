import Doc, { router } from "../../mod/doc/mod"
import * as generic from "../services/generic.service"

export default function Router({ routes }: { routes: RouteConstructor[] }) {
  const View: HTMLDivElement = <div id="router" />
  router({ routes, target: View })
    .onLoad(() => generic.isLoading.set(true))
    .onLoadEnd(() => generic.isLoading.set(false))
  return View
}
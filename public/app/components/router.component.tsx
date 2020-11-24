import { createElement, useRouter } from "../../modules/doc/mod"
import * as generic from "../services/generic.service"

export default function Router({ routes }: { routes: RouteConstructor[] }) {
  const View: HTMLDivElement = <div id="router" />
  useRouter({ routes, target: View })
    .onLoad(() => generic.isLoading.set(true))
    .onLoadEnd(() => generic.isLoading.set(false))
  return View
}
import Doc from "../../modules/doc/mod"
import i18n from "../../lang/de_DE.json"
import * as µ from "../components/mu.component"

export default function RouteNotFoundView(): HTMLDivElement {
  return (
    <µ.Box id="route-not-found">
      <µ.Header>{i18n.error}</µ.Header>
      <div className="box message">
        {i18n.routeNotFound.replace("$url", location.pathname)}
      </div>
    </µ.Box>
  )
}
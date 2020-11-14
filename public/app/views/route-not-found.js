// @ts-check
import i18n from "../../lang/de_DE.js"

import Box, { Header } from "../components/box.js"

export default function RouteNotFound() {
    return Box({ id: "route-not-found" },
        Header({}, i18n.error),
        Box({ className: "message" },
            i18n.routeNotFound.replace("$url", location.pathname)
        )
    )
}
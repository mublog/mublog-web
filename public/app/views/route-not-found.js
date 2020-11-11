// @ts-check
import i18n from "../../lang/de_DE.js"

import Box, { Seperator, Title } from "../components/box.js"

export default async function RouteNotFound() {
    return Box({ id: "route-not-found" },
        Title({}, i18n.error),
        Seperator(),
        Box({ className: "message" },
            i18n.routeNotFound.replace("$url", location.pathname)
        )
    )
}
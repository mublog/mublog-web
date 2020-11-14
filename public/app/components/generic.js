// @ts-check
import Doc, { useMixin } from "../../../modules/doc/module.js"

export function activateRoute(href) {
    history.pushState(null, "", href)
    dispatchEvent(new PopStateEvent("popstate"))
}


/**
 * @typedef {"menu-kebab" | "menu-meatballs" | "menu-bento"} MenuIcons
 */

/**
 * @typedef {"heart-grey" | "heart-pink" | "heart-red"} HeartIcons
 */

/**
 * @typedef {"magnifier" | "clock" | "calendar" | HeartIcons | MenuIcons} AllIcons
 */

/**
 * @param {{ [key: string]: any, name: AllIcons }} props 
 */
export function Icon(props) {
    let className = "icon icon-"
    let iconName
    if (props.name) {
        iconName = props.name
        className += props.name
    }
    if (props.className) {
        className += " " + props.className
        delete props.className
    }

    const View = Doc.createNode("i", { ...props, className })

    return useMixin(View, {
        /** @param {AllIcons} name */
        set iconName(name) {
            View.classList.replace(`icon-${iconName}`, `icon-${name}`)
            iconName = name
        }
    })
}
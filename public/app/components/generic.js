// @ts-check
import Choc from "../../../modules/choc/module.js"

/**
 * @template props
 * @param {props} props 
 * @param {...(import("../../../modules/choc/module").default | string | Element)} children
 */
export function Div(props, ...children) {
    return Choc.create("div", props, ...children)
}

/**
 * @template props
 * @param {props} props 
 * @param {...(import("../../../modules/choc/module").default | string | Element)} children
 */
export function Span(props, ...children) {
    return Choc.create("span", props, ...children)
}

const aEvent = new PopStateEvent("popstate")
/**
 * @template props
 * @param {props & { href: string }} props 
 * @param {...(import("../../../modules/choc/module").default | string | Element)} children
 */
export function Route(props, ...children) {
    return Choc.create("a", props, ...children).addEvent("click", (node, event) => {
        event.preventDefault()
        activateRoute(props.href)
    })
}

export function activateRoute(href) {
    history.pushState(null, null, href)
    dispatchEvent(aEvent)
}

/**
 * @template props
 * @param {props} props 
 * @param {...(import("../../../modules/choc/module").default | string | Element)} children
 */
export function A(props, ...children) {
    return Choc.create("a", props, ...children)
}

/**
 * @typedef {"menu-kebab" | "menu-meatballs" | "menu-bento"} MenuIcons
 */

/**
 * @typedef {"heart-grey" | "heart-pink" | "heart-red"} HeartIcons
 */

/**
 * @param {"magnifier" | "clock" | "calendar" | HeartIcons | MenuIcons} iconName 
 * @param {any} props 
 */
export function Icon(iconName, props = {}) {
    let className = "icon icon-" + iconName
    if (props.className) {
        className += " " + props.className
        delete props.className
    }
    return Choc.create("i", { ...props, className })
}
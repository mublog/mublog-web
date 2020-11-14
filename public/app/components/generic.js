// @ts-check
import Doc, { useEvent } from "../../../modules/doc/module.js"

const aEvent = new PopStateEvent("popstate")

/**
 * @param {any} props 
 * @param {...any} children
 */
export function Route(props, ...children) {
    return useEvent(Doc.createNode("a", props, ...children), "click", (event) => {
        event.preventDefault()
        if (props.href.isState) {
            activateRoute(props.href.value)
        }
        else {
            activateRoute(props.href)
        }
    })
}

export function activateRoute(href) {
    history.pushState(null, null, href)
    dispatchEvent(aEvent)
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
    if (props.name) {
        className += props.name
    }
    if (props.className) {
        className += " " + props.className
        delete props.className
    }
    return Doc.createNode("i", { ...props, className })
}
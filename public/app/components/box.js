// @ts-check
import Doc, { useEvent, useMixin, useStyles } from "../../../modules/doc/module.js"

/** 
 * @param {any} props
 * @param {...any} children
 */
export default function Box(props, ...children) {
    let className = "box"
    if (props.className) {
        className += " " + props.className
        delete props.className
    }
    return Doc.createNode("div", { ...props, className }, ...children)
}

/**
 * @typedef {"top-left" | "top-right" | "bottom-left" | "bottom-right" | "top" | "left" | "bottom" | "right"} ArrowType
 */

/**
 * @param {ArrowType} type 
 * @param {number} x 
 * @param {number} y 
 */
export function Arrow(type, x = 0, y = 0) {
    function createPosition(x, y) {
        return { 
            left: `${x}%`,
            top: `${y}%`
        }
    }
    const arrow = Doc.createNode("div", { className: `arrow arrow-${type}` })
    if (x || 0) {
        useStyles(arrow, createPosition(x, y))
    }
    return useMixin(arrow, {
        /** @param {ArrowType} type */
        updateType(type) {
            arrow.className = `arrow arrow-${type}`
            return arrow
        },
        updateAxis(x, y) {
            useStyles(arrow, createPosition(x, y))
            return arrow
        }
    })
}

export function Seperator() {
    return Doc.createNode("div", { className: "seperator" })
}

/** 
 * @param {...any} children
 */
export function Title(props, ...children) {
    let className = "title header-content"
    if (props.className) {
        className += " " + props.className
        delete props.className
    }
    return Doc.createNode("div", { ...props, className }, ...children)
}

/** 
 * @param {any} props
 * @param {...any} children
 */
export function Header(props, ...children) {
    let className = "header"
    if (props.className) {
        className += " " + props.className
        delete props.className
    }
    return Doc.createNode("div", { ...props, className },
        Title({}, ...children),
        Seperator()
    )
}

/** 
 * @param {any} props
 * @param {...any} children
 */
export function Footer(props, ...children) {
    let className = "footer-content"
    if (props.className) {
        className += " " + props.className
    }
    return Doc.createNode("div", { className: "footer" },
        Seperator(),
        Doc.createNode("div", { ...props, className }, ...children)
    )
}

/** 
 * @param {{ labelText: string, [key: string]: any }} props
 * @param {...any} children
 */
export function Label(props, ...children) {
    let className = "label"
    let labelText = props.labelText
    delete props.labelText
    if (props.className) {
        className += " " + props.className
        delete props.className
    }
    return Doc.createNode("div", { ...props, className }, 
        Doc.createNode("label", { className: "label-content" }, labelText),
        ...children
    )
}

/** 
 * @param {any} props
 * @param {...any} children
 */
export function Button(props, ...children) {
    let className = "button"
    if (props.className) {
        className += " " + props.className
        delete props.className
    }
    return Doc.createNode("button", { ...props, className },
        Doc.createNode("div", { className: "button-content" }, ...children)
    )
}
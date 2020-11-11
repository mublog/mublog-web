// @ts-check
import Choc from "../../../modules/choc/module.js"

/**
 * @template T
 * @typedef {T & { [key: string]: any }} Properties
 */

/**
 * @typedef BoxProperties
 * @property {string} className
 */

/**
 * @template props
 * @typedef {import("../../../modules/choc/module").default<"div", props & BoxProperties>} Box
 */

/** 
 * @template props
 * @param {Properties<props>} props
 * @param {...(import("../../../modules/choc/module").default | string | Element)} children
 * @returns {import("../../../modules/choc/module").default<"div", props & BoxProperties>}
 */
export default function Box({ ...props }, ...children) {
    let className = "box"
    if (props.className) {
        className += " " + props.className
        delete props.className
    }
    return Choc.create("div", { ...props, className }, ...children)
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
    /** 
     * @param {number} x
     * @param {number} y
     * @returns {Partial<CSSStyleDeclaration>}
     */
    function createPosition(x, y) {
        return { 
            left: `${x}%`,
            top: `${y}%`
        }
    }

    let arrow = Choc.create("div", { className: `arrow arrow-${type}` })

    if (x || 0) {
        arrow.style(createPosition(x, y))
    }

    return arrow.mixin({
        /**
         * @param {ArrowType} type 
         */
        updateType(type) {
            arrow.nativeElement.className = `arrow arrow-${type}`
            return arrow
        },
        updateAxis(x, y) {
            arrow.style(createPosition(x, y))
            return arrow
        }
    })
}

export function Seperator() {
    return Choc.create("div", { className: "seperator" })
}

/** 
 * @template props
 * @param {Properties<props>} props
 * @param {...(import("../../../modules/choc/module").default | string | Element)} children
 * @returns {import("../../../modules/choc/module").default<"div", props & BoxProperties>}
 */
export function Title({ ...props }, ...children) {
    let className = "title"
    if (props.className) {
        className += " " + props.className
        delete props.className
    }
    return Choc.create("div", { ...props, className }, ...children)
}

/** 
 * @template props
 * @param {Properties<props & { labelText: string }>} props
 * @param {...(import("../../../modules/choc/module").default | string | Element)} children
 */
export function Label(props, ...children) {
    let className = "label"
    let labelText = props.labelText
    delete props.labelText
    if (props.className) {
        className += " " + props.className
        delete props.className
    }
    return Choc.create("div", { ...props, className }, 
        Choc.create("label", { className: "label-content" }, labelText),
        ...children
    )
}

/** 
 * @template props
 * @param {props} props
 */
export function Input(props) {
    let input = Choc.create("input", props)
    return Choc.create("div", { className: "input" }, input).mixin({
        get ref() {
            return input.nativeElement
        }
    })
}

/** 
 * @template props
 * @param {props} props
 */
export function Textarea(props) {
    let textarea = Choc.create("textarea", props)
    return Choc.create("div", { className: "input" }, textarea).mixin({
        get ref() {
            return textarea.nativeElement
        },
        get node() {
            return textarea
        }
    })
}

/** 
 * @template props
 * @param {Properties<props>} props
 * @param {...(import("../../../modules/choc/module").default | string | Element)} children
 */
export function Button(props, ...children) {
    let className = "button"
    if (props.className) {
        className += " " + props.className
        delete props.className
    }
    return Choc.create("button", { ...props, className },
        Choc.create("div", { className: "button-content" }, ...children)
    )
}
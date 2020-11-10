// @ts-check
import Choc from "../../../module.js"

/**
 * @template T
 * @typedef {T & { [key: string]: any }} Properties
 */

/**
 * @typedef FlexOptions
 * @property {string} [gap]
 * @property {"row" | "row-reverse" | "column" | "column-reverse"} [direction]
 * @property {string} [alignItems]
 */

/**
 * @template props
 * @param {Properties<props> & FlexOptions} props 
 * @param {...(import("../../../module").default | string | Element)} children
 */
export default function Flex(props, ...children) {
    /**
     * @type {Partial<CSSStyleDeclaration>}
     */
    let styles = {
        display: "flex"
    }

    if (props.gap) {
        styles.gap = props.gap
        delete props.gap
    }

    if (props.direction) {
        styles.flexDirection = props.direction
        delete props.direction
    }

    if (props.alignItems) {
        styles.alignItems = props.alignItems
        delete props.alignItems
    }

    return Choc.create("div", { ...props, styles }, ...children)
}
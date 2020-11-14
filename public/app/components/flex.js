// @ts-check
import Doc, { useStyles } from "../../../modules/doc/module.js"

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
 * @param {FlexOptions & { [key: string]: any}} props 
 * @param {...any} children
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
    // @ts-expect-error
    return useStyles(Doc.createNode("div", props, ...children), styles)
}
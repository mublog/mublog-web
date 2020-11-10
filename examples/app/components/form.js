// @ts-check
import Choc from "../../../module.js"

/** 
 * @template props
 * @param {props} props
 * @param {...(import("../../../module").default | string | Element)} children
 */
export default function Form({ ...props }, ...children) {
    let submitCallbacks = []
    const form = Choc.create("form", props, ...children).mixin({
        /** @param {(node: import("../../../module").default<"form", props>, event: Event) => any} callback  */
        onSubmit(callback) {
            submitCallbacks.push(callback)
            return form
        }
    })
        .addSignal("submit", (node, event) => {
            event.preventDefault()
            submitCallbacks.forEach(cb => cb(node, event))
        })
        .addEvent("submit", (node, event) => node.signal("submit", event))
    return form
}
// @ts-check
import Choc from "../../module.js"

/**
 * @param {import("../choc.js").default} node 
 * @param {(Element | import("../choc.js").default | string)[]} children 
 */
export default function setChildren(node, children) {
    for (let child of children) {
        let childElement
        if (typeof child == "string") {
            childElement = document.createTextNode(child)
        }
        else if (child instanceof Choc) {
            childElement = child.nativeElement
            if (child.has("key")) {
                node.$children.set(child.get("key"), child)
            }
        }
        else if (child instanceof Element) {
            childElement = child
        }
        if (childElement) {
            node.nativeElement.appendChild(childElement)
        }
    }
}
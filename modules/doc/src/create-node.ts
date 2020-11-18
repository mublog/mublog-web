import type { HTMLProperties, MappedElement, State, Subscriber } from "./types"

/**
 * Creates an HTMLElement that can be directly appended to the **DOM**.\
 * The Element itself has no extra methods to stay lightweight.
 * @param tag Tag of an HTMLElement from **HTMLElementTagNameMap**
 * @param props Properties to set for the HTMLElement
 * @param children Nodes children
 * 
 * @example
 * let node = Doc.createElement("div", { id: "app", className: "node" },
 *   Doc.createElement("span", null, "Hello World")
 * )
 */
export default function createElement<Tag extends keyof HTMLElementTagNameMap>(
    tag: Tag, 
    props: Partial<HTMLProperties<Tag>> = {},
    ...children: any[]
): MappedElement<Tag> {
    if (typeof tag === "function") {
        /**
         * Doc.createElement can be used as a TSX/ JSX function.
         * Therefore, the first real argument will be set by the component function.
         */
        // @ts-expect-error
        return tag(props, children)
    }
    let el = document.createElement(tag) as unknown as MappedElement<Tag>
    setProperties(el, props)
    setChildren(el, children)
    return el
}

/**
 * Sets Properties for the Element and subscribes States if needed
 * @param el HTMLElement Object
 * @param props Every property you can imagine!
 */
function setProperties<Target extends Element>(el: Target, props: any) {
    for (const key in props) {
        if (props[key].isState === true) {
            const state: State<any> = props[key]
            const subscription = (val: any) => {
                if (!el) {
                    return state.unsubscribe(subscription)
                }
                el[key] = val
            }
            state.subscribe(subscription)
            el[key] = props[key].value
        }
        else {
            el[key] = props[key]
        }
    }
}

/**
 * @param el Parent HTMLElement
 * @param children Children Elements
 */
function setChildren<Target extends Element>(el: Target, children: any[]) {
    children.forEach(child => appendChild(el, child))
}

/**
 * Recursively appends Child Elements to the Parent Element.\
 * The Child itself can be a Array, string, number or a State<Element | Element[] | string | number>
 * @param el Parent HTMLElement
 * @param child Single given child Element
 */
function appendChild<Target extends Element>(el: Target, child: any) {
    /**
     * Append recursively
     */
    if (Array.isArray(child)) {
        child.forEach(subChild => appendChild(el, subChild))
    }
    /**
     * Append TextNode
     */
    else if (typeof child === ("string" || "number")) {
        el.appendChild(document.createTextNode(child + ""))
    }
    /**
     * Append your regular Element
     */
    else if (child instanceof Element) {
        el.appendChild(child)
    }
    /**
     * This is going to be special
     */
    else if (child.isState) {
        /**
         * First, we don't know what the children are,\
         * but we will subscribe to the changes anyway,\
         * there might be Elements waiting for us.
         */
        if (Array.isArray(child.value)) {
            const state: State<any> = child
            let subscription: Subscriber<any> = val => {
                if (!el) {
                    return state.unsubscribe(subscription)
                }
                el.innerHTML = ""
                appendChild(el, val)
            }
            state.subscribe(subscription)
        }
        /**
         * You wanted to subscribe to basic values? That's okay too!
         */
        else if (typeof child.value === ("string" || "number")) {
            const state: State<string | number> = child
            let subDoc = document.createTextNode(state.value + "")
            let subscription: Subscriber<string | number> = val => {
                if (!el) {
                    return state.unsubscribe(subscription)
                }
                subDoc.textContent = val + ""
            }
            state.subscribe(subscription)
            el.appendChild(subDoc)
        }
    }
}
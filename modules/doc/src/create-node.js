// @ts-check

/**
 * @template tag
 * @typedef {{ [key in keyof HTMLElementTagNameMap[tag & keyof HTMLElementTagNameMap]]: any }} HTMLProperties
 */

/**
 * @template tag
 * @typedef {HTMLElementTagNameMap[tag & keyof HTMLElementTagNameMap]} MappedHTMLElement
 */

/**
 * @template tag
 * @param {tag & keyof HTMLElementTagNameMap} tag 
 * @param {Partial<HTMLProperties<tag>> & { [key: string]: any} } props 
 * @param  {...any} children
 * @returns {MappedHTMLElement<tag>}
 */
export default function createNode(tag, props = null, ...children) {
    if (typeof tag === "function") {
        // @ts-expect-error
        return tag(props, children)
    }

    let el = document.createElement(tag)
    for (const key in props) {
        if (props[key].isState === true) {
            props[key].subscribe(val => el[key] = val)
            el[key] = props[key].value
        }
        else {
            el[key] = props[key]
        }
    }
    setChildren(el, children)
    return el
}

/**
 * @param {Element} el 
 * @param {any[]} children 
 */
function setChildren(el, children) {
    children.forEach(child => appendChild(el, child))
}

/**
 * @param {Element} el 
 * @param {any} child
 */
function appendChild(el, child) {
    if (Array.isArray(child)) {
        child.forEach(subChild => appendChild(el, subChild))
    }
    else if (typeof child === "string") {
        el.appendChild(document.createTextNode(child))
    }
    else if (child instanceof Element) {
        el.appendChild(child)
    }
    else if (child.isState) {
        if (Array.isArray(child.value)) {
            let subscription = val => {
                if (!el) {
                    return child.unsubscribe(subscription)
                }
                el.innerHTML = ""
                appendChild(el, val)
            }
            child.subscribe(subscription)
        }
        else if (child.value instanceof Element) {
            el.appendChild(child.value)
            let subscription = val => {
                if (!el) {
                    return child.unsubscribe(subscription)
                }
                el.innerHTML = ""
                el.appendChild(val)
            }
            child.subscribe(subscription)
        }
        else if (typeof child.value === ("string" || "number")) {
            let subDoc = document.createTextNode(String(child.value))
            let subscription = val => {
                if (!el) {
                    return child.unsubscribe(subscription)
                }
                subDoc.textContent = String(val)
            }
            child.subscribe(subscription)
            el.appendChild(subDoc)
        }
    }
}
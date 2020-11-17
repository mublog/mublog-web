import type { HTMLProperties, MappedElement, State } from "./types"

export default function createNode<Tag extends keyof HTMLElementTagNameMap>(
    tag: Tag, 
    props: Partial<HTMLProperties<Tag>> = {},
    ...children: any[]
): MappedElement<Tag> {
    if (typeof tag === "function") {
        // @ts-expect-error
        return tag(props, children)
    }
    let el = document.createElement(tag) as unknown as MappedElement<Tag>
    setProperties(el, props)
    setChildren(el, children)
    return el
}

function setProperties<Target extends Element>(el: Target, props: any) {
    for (const key in props) {
        if (props[key].isState === true) {
            const state: State<any> = props[key]
            state.subscribe(val => el[key] = val)
            state.value = props[key].value
        }
        else {
            el[key] = props[key]
        }
    }
}

function setChildren(el: Element, children: any[]) {
    children.forEach(child => appendChild(el, child))
}

function appendChild(el: Element, child: any) {
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
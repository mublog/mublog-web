// @ts-check

/**
 * @template props
 * @param {import("../choc.js").default} node 
 * @param {keyof props & string} state 
 * @param {any} value 
 */
export default function set(node, state, value) {
    if (node.has(state) && node.get(state) !== value) {
        node.$states.set(state, value)
        node.nativeElement[state] = value
        node.signal(state, value)
    }
}
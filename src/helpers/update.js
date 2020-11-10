// @ts-check
/**
 * @template props
 * @param {import("../choc.js").default} node 
 * @param {Partial<{ [key in keyof props]: any }>} updates 
 */
export default function update(node, updates) {
    for (let state in updates) {
        node.set(state, updates[state])
    }
}
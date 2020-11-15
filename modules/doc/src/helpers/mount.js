// @ts-check
/**
 * @template target, node
 * @param {target & Element} target 
 * @param {node & Element} node
 * @returns {node}
 */
export function mount(target, node) {
    target.replaceWith(node)
    return node
}

/**
 * @template node
 * @param {node & Element} node 
 */
export function unmount(node) {
    node.remove()
    node = undefined
}
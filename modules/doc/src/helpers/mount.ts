export function mount<Node extends Element>(target: Element, node: Node): Node {
    target.replaceWith(node)
    return node
}

export function unmount(node: Element): void {
    node.remove()
    node = undefined
}
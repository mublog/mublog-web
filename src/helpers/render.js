/**
 * @param {import("../choc").default} node 
 */
export default function render(node) {
    node.$el = document.createElement(node.$tagRef)
    Object.assign(node.nativeElement, node.$propsRef)
    for (let prop in node.$propsRef) {
        node.$states.set(prop, node.$propsRef[prop])
    }
    node.append(...node.$childrenRef)
}
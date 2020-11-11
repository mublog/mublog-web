/**
 * @param {import("../choc").default} node 
 */
export default function render(node) {
    node.$el = document.createElement(node.$tagRef)
    Object.assign(node.nativeElement, node.$propsRef)
    for (let prop in node.$propsRef) {
        node.$states.set(prop, node.$propsRef[prop])
    }
    if (node.$propsRef && node.$propsRef.styles) {
        node.$styles.addGroup(node.$propsRef.styles)
    }
    if (node.$propsRef && node.$propsRef.events) {
        for (let event in node.$propsRef.events) {
            node.addEvent(event, node.$propsRef.events[event])
        }
    }
    node.append(...node.$childrenRef)
}
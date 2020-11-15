// @ts-check
import Doc, { useEvent, useMixin, useState, useStyles } from "../../../modules/doc/module.js"
import Box, { Arrow, Header, Footer } from "../components/box.js"

export function MenuItem(child) {
    return Doc.createNode("li", { className: "menu-item" }, child)
}

export default function Menu(props, ...children) {
    const Visibility = useState(false)
    let className = "menu"
    if (props.className) {
        className += " " + props.className
        delete props.className
    }
    const MenuItems = children.map(child => MenuItem(child))
    const View = Box({ ...props, className },
        Doc.createNode("ul", { className: "container" }, MenuItems)
    )

    Visibility.subscribe(state => useStyles(View, { display: !state ? "none !important" : "" }))

    useEvent(View, "click", event => event.stopPropagation())

    return useMixin(View, {
        get isMenu() {
            return true
        },
        toggle() {
            Visibility.value = !Visibility.value ? true : false 
        },
        show() {
            Visibility.value = true
        },
        hide() {
            Visibility.value = false
        },
        set(position, top, left) {
            useStyles(View, { position, top, left })
        }
    })
}
import Doc, { useMixin } from "../../../modules/doc/module"

export function activateRoute(href: string) {
    history.pushState(null, "", href)
    dispatchEvent(new PopStateEvent("popstate"))
}

export type Icons =
    "menu-kebab" | "menu-meatballs" | "menu-bento" |
    "heart-grey" | "heart-pink" | "heart-red" |
    "comment-bubbles-grey" | "comment-bubbles" |
    "magnifier" | "clock" | "calendar"

export function Icon(props: Partial<HTMLElement> & { name: Icons}) {
    let className = "icon icon-"
    let iconName: string
    if (props.name) {
        iconName = props.name
        className += props.name
    }
    if (props.className) {
        className += " " + props.className
        delete props.className
    }

    const View = Doc.createNode("i", { ...props, className })

    return useMixin(View, {
        set iconName(name: Icons) {
            View.classList.replace(`icon-${iconName}`, `icon-${name}`)
            iconName = name
        }
    })
}
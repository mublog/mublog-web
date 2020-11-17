import Doc, { useMixin, useStyles } from "../../../modules/doc/module"

export default function Box(
    props: Partial<HTMLDivElement>, 
    ...children: any[]
) {
    let className = "box"
    if (props.className) {
        className += " " + props.className
        delete props.className
    }
    return Doc.createNode("div", { ...props, className }, ...children)
}

export type ArrowType = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top" | "left" | "bottom" | "right"

export type ArrowConstructor = {
    type: ArrowType
    x?: number
    y?: number
}

export function Arrow(props: ArrowConstructor) {
    const arrow = Doc.createNode("div", { className: `arrow arrow-${props.type}` })
    if (!["top-left", "top-right", "bottom-left", "bottom-right"].includes(props.type)) {
        useStyles(arrow, createPosition(props.x || 0, props.y || 0))
    }
    return useMixin(arrow, {
        updateType(type: ArrowType) {
            arrow.className = `arrow arrow-${type}`
            return arrow
        },
        updateAxis(x: number, y: number) {
            useStyles(arrow, createPosition(x, y))
            return arrow
        }
    })
}

export function Seperator() {
    return Doc.createNode("div", { className: "seperator" })
}

export function Title(props: Partial<HTMLDivElement>, ...children: any[]) {
    let className = "title header-content"
    if (props.className) {
        className += " " + props.className
        delete props.className
    }
    return Doc.createNode("div", { ...props, className }, ...children)
}

export function Header(props: Partial<HTMLDivElement>, ...children: any[]) {
    let className = "header"
    if (props.className) {
        className += " " + props.className
        delete props.className
    }
    return Doc.createNode("div", { ...props, className },
        Title({}, ...children),
        Seperator()
    )
}

export function Footer(props: Partial<HTMLDivElement>, ...children: any[]) {
    let className = "footer-content"
    if (props.className) {
        className += " " + props.className
    }
    return Doc.createNode("div", { className: "footer" },
        Seperator(),
        Doc.createNode("div", { ...props, className }, ...children)
    )
}

export function Label(
    props: Partial<HTMLDivElement> & { labelText: string },
    ...children: any[]
) {
    let className = "label"
    let labelText = props.labelText
    delete props.labelText
    if (props.className) {
        className += " " + props.className
        delete props.className
    }
    return Doc.createNode("div", { ...props, className }, 
        Doc.createNode("label", { className: "label-content" }, labelText),
        ...children
    )
}

export function Button(
    props: Partial<HTMLButtonElement>, 
    ...children: any[]
) {
    let className = "button"
    if (props.className) {
        className += " " + props.className
        delete props.className
    }
    return Doc.createNode("button", { ...props, className },
        Doc.createNode("div", { className: "button-content" }, ...children)
    )
}

function createPosition(x: number, y: number) {
    return { 
        left: `${x}%`,
        top: `${y}%`
    }
}
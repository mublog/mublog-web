import Doc, { useStyleGroup } from "../../../modules/doc/module"

export interface FlexOptions {
    gap?: string
    direction?: "row" | "row-reverse" | "column" | "column-reverse"
    alignItems?: string
}

export default function Flex(
    props: Partial<HTMLDivElement> & FlexOptions, 
    ...children: any[]
) {
    let styles: Partial<CSSStyleDeclaration> = {
        display: "flex"
    }

    if (props.gap) {
        styles.gap = props.gap
        delete props.gap
    }

    if (props.direction) {
        styles.flexDirection = props.direction
        delete props.direction
    }

    if (props.alignItems) {
        styles.alignItems = props.alignItems
        delete props.alignItems
    }
    return useStyleGroup(Doc.createElement("div", props, ...children), styles)
}
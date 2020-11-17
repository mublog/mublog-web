import Doc, { useMixin, useStyles } from "../../../modules/doc/module"

export type UserImageElement = HTMLDivElement & {
    userImage: string
}

export default function UserImage(props: Partial<HTMLDivElement> = {}): UserImageElement {
    let className = "user-image-wrap"
    if (props.className) {
        className += " " + props.className
        delete props.className
    }
    const View = Doc.createNode("div", { ...props, className },
        Doc.createNode("div", { className: "user-image" }),
        Doc.createNode("div", { className: "user-image-frame" })
    )
    const ViewUserImageRef = Doc.query<HTMLDivElement>(View, ".user-image")
    return useMixin(View, {
        set userImage(url: string) {
            useStyles(ViewUserImageRef, { 
                backgroundImage: `url("${url}")`
            })
        }
    })
}
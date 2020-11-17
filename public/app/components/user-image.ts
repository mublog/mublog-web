import Doc, { useMixin, useStyles } from "../../../modules/doc/module"

export interface UserImageElement extends HTMLDivElement {
    userImage: string
}

export interface UserImageConstructor extends Partial<HTMLDivElement> {
    userImage?: string
}

export default function UserImage(props: UserImageConstructor): UserImageElement {
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

    const Mixin = useMixin(View, {
        set userImage(url: string) {
            useStyles(ViewUserImageRef, { 
                backgroundImage: `url("${url}")`
            })
        }
    })

    if (props.userImage) {
        Mixin.userImage = props.userImage
    }

    return Mixin
}
import Doc, { useMixin, useStyles } from "../../../modules/doc/module"

export interface UserImageElement extends HTMLDivElement {
    userImage: string
}

export interface UserImageConstructor extends Partial<HTMLDivElement> {
    userImage?: string
}

export default function UserImage(props: UserImageConstructor): UserImageElement {
    let className = "user-image-wrap"
    let userImage: string
    if (props.className) {
        className += " " + props.className
        delete props.className
    }
    if (props.userImage) {
        userImage = props.userImage
        delete props.userImage
    }
    const View = Doc.createElement("div", { ...props, className },
        Doc.createElement("div", { className: "user-image" }),
        Doc.createElement("div", { className: "user-image-frame" })
    )
    const ViewUserImageRef = Doc.query<HTMLDivElement>(View, ".user-image")

    const Mixin = useMixin(View, {
        set userImage(url: string) {
            useStyles(ViewUserImageRef, { 
                backgroundImage: `url("${url}")`
            })
        }
    })

    Mixin.userImage = userImage

    return Mixin
}
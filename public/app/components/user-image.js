// @ts-check
import Doc, { useMixin, useStyles } from "../../../modules/doc/module.js"

export default function UserImage() {
    const View = Doc.createNode("div", { className: "user-image-wrap" },
        Doc.createNode("div", { className: "user-image" }),
        Doc.createNode("div", { className: "user-image-frame" })
    )
    const ViewUserImageRef = Doc.query(View, "div", ".user-image")
    return useMixin(View, {
        set userImage(url) {
            useStyles(ViewUserImageRef, { 
                backgroundImage: `url("${url}")`
            })
        }
    })
}
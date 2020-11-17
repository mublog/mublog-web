import Doc, { useStyles } from "../../../modules/doc/module"
import UserImage, { UserImageElement } from "./user-image"
import { UserService } from "../services/user"

const Header = (function() {
    const View = Doc.createNode("div", { id: "header" },
        Doc.createNode("div", { className: "header-content" },
            Doc.createNode("div", { className: "header-profile" },
                UserImage({ className: "user-profile-header" })
            )
        )
    )
    const UserImageRef = Doc.query<UserImageElement>(View, ".user-image-header")
    UserService.subscribe(state => {
        useStyles(View, { 
            display: state.loggedIn === false ? "none !important" : "",
        })
        UserImageRef.userImage = state.profileImageUrl
    })
    return View
})()

export default Header
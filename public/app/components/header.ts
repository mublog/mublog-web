import Doc from "../../../modules/doc/module"
import UserImage, { UserImageElement } from "./user-image"
import { UserService } from "../services/user"

const styleHidden = Doc.createStyle({ display: "none !important" })

const Header = (function() {
    const View = Doc.createNode("div", { id: "header" },
        Doc.createNode("div", { className: "header-content" },
            Doc.createNode("div", { className: "header-profile" },
                UserImage({ className: "user-image-header" })
            )
        )
    )
    const UserImageRef = Doc.query<UserImageElement>(View, ".user-image-header")
    UserService.subscribe(({ loggedIn, profileImageUrl }) => {
        loggedIn ? View.classList.remove(styleHidden) : View.classList.add(styleHidden)
        UserImageRef.userImage = profileImageUrl
    })
    return View
})()

export default Header
import Doc, { useStyles } from "../../../modules/doc/module"
import UserImage from "./user-image"
import { User as UserSerive } from "../services/user"

const Header = (function() {
    const ViewUserImage = UserImage()
    const View = Doc.createNode("div", { id: "header" },
        Doc.createNode("div", { className: "header-content" },
            Doc.createNode("div", { className: "header-profile" },
                ViewUserImage
            )
        )
    )
    UserSerive.subscribe(state => {
        useStyles(View, { 
            display: state.loggedIn === false ? "none !important" : "",
        })
        ViewUserImage.userImage = state.profileImageUrl
    })
    return View
})()

export default Header
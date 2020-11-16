// @ts-check
import i18n from "../../lang/de_DE.js"
import Doc, { useStyles } from "../../../modules/doc/module.js"
import UserImage from "../components/user-image.js"
import { User } from "../services/fakedb.js"

const Header = (function() {
    const ViewUserImage = UserImage()
    const View = Doc.createNode("div", { id: "header" },
        Doc.createNode("div", { className: "header-content" },
            Doc.createNode("div", { className: "header-profile" },
                ViewUserImage
            )
        )
    )
    User.subscribe(state => {
        useStyles(View, { 
            display: state.loggedIn === false ? "none !important" : "",
        })
        ViewUserImage.userImage = state.profileImageUrl
    })
    return View
})()

export default Header
// @ts-check
import Doc, { useState } from "../../../modules/doc/module.js"
import Post from "../components/post.js"
import Flex from "../components/flex.js"
import Writer from "../components/writer.js"
import Notifications from "../components/notifications.js"
import * as db from "../services/fakedb.js"
import i18n from "../../lang/de_DE.js"

export default function Home() {
    if (db.User.value.loggedIn === false) {
        return GuestHome()
    }
    return UserHome()
}

function UserHome() {
    let PostArray = useState([])
    db.Posts.unsubscribeAll()
    db.Posts.subscribe(posts => PostArray.value = posts.map(({ value }) => Post(value)).reverse())

    const ViewWriter = Writer()
    const View = Flex({ direction: "column", gap: "8px" },
        ViewWriter,
        Doc.createNode("div", { className: "post-container" }, PostArray)
    )

    ViewWriter.onSubmit(event => {
        if (ViewWriter.rawText.length < 4) {
            Notifications.push(null, i18n.messageTooShort)
            return
        }
        if (ViewWriter.rawText.length > 1024) {
            Notifications.push(null, i18n.messageTooLong)
            return
        }
        db.Posts.insert(ViewWriter.text)
        ViewWriter.reset()
    })

    return View
}

function GuestHome() {
    let PostArray = useState([])
    db.Posts.unsubscribeAll()
    db.Posts.subscribe(posts => PostArray.value = posts.map(({ value }) => Post(value)).reverse())

    const View = Flex({ direction: "column", gap: "8px" },
        Doc.createNode("div", { className: "post-container" }, PostArray)
    )
    return View
}
import Doc, { useState } from "../../../modules/doc/module"
import Post, { PostElement } from "../components/post"
import Flex from "../components/flex"
import Writer, { WriterElement } from "../components/writer"
import Notifications from "../components/notifications"
import { CurrentPosts as PostService } from "../services/posts"
import { UserService, Users } from "../services/user"
import i18n from "../../lang/de_DE.json"
import { Post as PostType } from "../definitions/post"

export default function Home() {
    if (!UserService.isLoggedIn()) {
        return GuestHome()
    }
    return UserHome()
}

const fakeWait = () => new Promise(res => setTimeout(res, 500))

function UserHome() {
    let PostArray = useState<PostElement[]>([])

    PostService.reset()
    PostService.unsubscribeAll()
    PostService.subscribe(posts => PostArray.value = posts.map(({ value }) => Post(value)).reverse())

    const View = Flex({ direction: "column", gap: "8px" },
        Writer({ className: "writer-home" }),
        Doc.createNode("div", { className: "post-container" }, PostArray)
    )

    const ViewWriterRef = Doc.query<WriterElement>(View, ".writer-home")

    ViewWriterRef.onSubmit(async event => {
        if (ViewWriterRef.rawText.length < 4) {
            ViewWriterRef.classList.remove("loading-circle")
            Notifications.push(null, i18n.messageTooShort)
            return
        }
        if (ViewWriterRef.rawText.length > 1024) {
            Notifications.push(null, i18n.messageTooLong)
            return
        }
        ViewWriterRef.classList.add("loading-circle")
        await fakeWait()
        PostService.insert(ViewWriterRef.rawText)
        ViewWriterRef.reset()
        ViewWriterRef.classList.remove("loading-circle")
    })

    return View
}

function GuestHome() {
    let PostArray = useState<PostElement[]>([])
    PostService.unsubscribeAll()
    PostService.subscribe(posts => PostArray.value = posts.map(({ value }) => Post(value)).reverse())
    const View = Flex({ direction: "column", gap: "8px" },
        Doc.createNode("div", { className: "post-container" }, PostArray)
    )
    return View
}
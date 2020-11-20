import Doc from "../../modules/doc/module"
import Flex from "../components/flex.component"
import Writer, { WriterElement } from "../components/writer.component"
import Notifications from "../components/notification.component"
import PostService from "../services/post.service"
import { UserService, Users } from "../services/user.service"
import i18n from "../../lang/de_DE.json"
import type { Post as PostType } from "../definitions/post"

const HomePosts: Pick<PostType, "user" | "textContent">[] = [
    { user: Users.findOne("anton"), textContent: "Hoi! 3" },
    { user: Users.findOne("max"), textContent: "Hoi! 2" },
    { user: Users.findOne("iljushka"), textContent: "Hoi! 1" }
]

function loadHomePosts() {
    HomePosts.map((hPost, i) => PostService.load(({
        ...hPost,
        id: Math.round(Math.random()*10000),
        commentAmount: 0,
        dateEdited: Date.now(),
        datePosted: Date.now() + i,
        likeAmount: 0,
    })))
    PostService.newestFirst()
    PostService.limit(10)
}


export default function Home() {
    loadHomePosts()
    if (!UserService.isLoggedIn()) {
        return GuestHome()
    }
    return UserHome()
}

const fakeWait = () => new Promise(res => setTimeout(res, 500))

function UserHome() {
    const View = Flex({ direction: "column", gap: "8px" },
        Writer({ className: "writer-home" }),
        Doc.createElement("div", { className: "post-container" }, PostService.getCurrent())
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
    const View = Flex({ direction: "column", gap: "8px" },
        Doc.createElement("div", { className: "post-container" }, PostService.getCurrent())
    )
    return View
}
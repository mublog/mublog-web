import Doc from "../../modules/doc/module"
import Flex from "../components/flex.component"
import Notifications from "../components/notification.component"
import PostService from "../services/post.service"
import { Users } from "../services/user.service"
import { Post as PostType } from "../definitions/post"

const presentation: Pick<PostType, "user" | "textContent">[] = [
    { user: Users.findOne("iljushka"), textContent: "Hallo Leute :3" },
    { user: Users.findOne("max"), textContent: "Alles klar bei euch?" },
    { user: Users.findOne("anton"), textContent: "Auch ein Hallo von mir :D" },
    { user: Users.findOne("iljushka"), textContent: "Heute zeigen wir euch mu-blog" },
    { user: Users.findOne("max"), textContent: "...Habe ich jedenfalls so gehört... :D" }
]

export default function Presentation() {
    PostService.newestFirst()
    presentationStart()
    const View = Flex({ direction: "column", gap: "8px" },
        Doc.createElement("div", { className: "post-container" }, PostService.getCurrent())
    )
    return View
}

async function presentationStart() {
    let i = 0
    Notifications.push("Willkommen auf mu-blog", "Gleich ist jemand für dich da")
    let interval = setInterval(() => {
        if (i >= presentation.length) {
            Notifications.push(null, "So das wars! Erstelle nun ein Konto und lege los :D")
            clearInterval(interval)
        }
        else {
            PostService.load({
                ...presentation[i],
                commentAmount: 0,
                dateEdited: Date.now(),
                datePosted: Date.now(),
                id: Math.round(Math.random()*1000),
                likeAmount: 0,
            })
            i++
        }
    }, Math.round(Math.random()*5000) + 2000)
} 
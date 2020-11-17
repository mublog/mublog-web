import Doc from "../../../modules/doc/module"
import Flex from "../components/flex"
import Notifications from "../components/notifications"
import { PostService } from "../services/posts"
import { Users } from "../services/user"
import { Post as PostType } from "../definitions/post"

type PresentationPost = Pick<PostType, "user" | "textContent">

const presentation: PresentationPost[] = [
    {
        user: Users.findOne("iljushka"),
        textContent: "Hallo Leute :3"
    },
    {
        user: Users.findOne("max"),
        textContent: "Alles klar bei euch?"
    },
    {
        user: Users.findOne("anton"),
        textContent: "Auch ein Hallo von mir :D"
    },
    {
        user: Users.findOne("iljushka"),
        textContent: "Heute zeigen wir euch mu-blog"
    },
    {
        user: Users.findOne("max"),
        textContent: "...Habe ich jedenfalls so gehört... :D"
    }
]

export default function Presentation() {
    Notifications.push("Willkommen auf mu-blog", "Gleich ist jemand für dich da")
    PostService.value = []
    presentationStart()
    const View = Flex({ direction: "column", gap: "8px" },
        Doc.createNode("div", { className: "post-container" }, PostService.getCurrent())
    )
    return View
}

async function presentationStart() {
    let i = 0
    let interval = setInterval(() => {
        if (i >= presentation.length) {
            Notifications.push(null, "So das wars! Erstelle nun ein Konto und lege los :D")
            clearInterval(interval)
        }
        else {
            PostService.load({
                ...presentation[i],
                commentAmount: 0,
                comments: [],
                dateEdited: Date.now(),
                datePosted: Date.now(),
                id: i,
                likeAmount: 0,
                likes: []
            })
            i++
        }
    }, Math.round(Math.random()*5000) + 2000)
} 
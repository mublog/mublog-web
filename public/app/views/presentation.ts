import Doc, { useState } from "../../../modules/doc/module"
import Post, { PostElement } from "../components/post"
import Flex from "../components/flex"
import Notifications from "../components/notifications"
import { CurrentPosts as PostService } from "../services/posts"
import { Users } from "../services/user"
import { Post as PostType } from "../definitions/post"

export default function Presentation() {
    Notifications.push("Willkommen auf mu-blog", "Gleich ist jemand für dich da")
    let PostArray = useState<PostElement[]>([])
    PostService.reset()
    PostService.unsubscribeAll()
    PostService.subscribe(posts => PostArray.value = posts.map(({ value }) => Post(value)).reverse())
    presentationStart()
    const View = Flex({ direction: "column", gap: "8px" },
        Doc.createNode("div", { className: "post-container" }, PostArray)
    )
    return View
}

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
    },
]

let i: number
let length = presentation.length

async function presentationStart() {
    i = 0
    let interval = setInterval(() => {
        if (i >= length) {
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
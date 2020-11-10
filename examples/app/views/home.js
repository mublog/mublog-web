// @ts-check
import Post from "../components/post.js"
import { Div } from "../components/generic.js"
import * as service from "../services/db.js"
import Flex from "../components/flex.js"

export default async function Home() {
    let posts = await service.getPosts(post => post)
    let component = Flex({ direction: "column", gap: "8px" },
        Div({ className: "post-container "},
            ...posts.map(post => Post(post))
        )
    )
    return component
}
// @ts-check
import Post from "../components/post.js"
import { Div } from "../components/generic.js"
import Flex from "../components/flex.js"
import Box, { Title, Seperator } from "../components/box.js"
import * as service from "../services/db.js"

export default async function User({ alias }) {
    let user = await service.getUser({ alias })
    let posts = await service.getPosts(post => post.user === user.id)
    let component = Flex({ direction: "column", gap: "8px" },
        Box({},
            Title({}, alias),
            Seperator(),
            Box({},
                "hello :D"
            )
        ),
        Div({ className: "post-container "},
            ...posts.map(post => Post(post))
        )
    )
    return component
}
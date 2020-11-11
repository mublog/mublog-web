// @ts-check
import Post from "../components/post.js"
import { Div } from "../components/generic.js"
import Flex from "../components/flex.js"
import Box, { Title, Seperator } from "../components/box.js"
import * as service from "../services/db.js"
import { loadingCircle } from "../components/decorators.js"

export default async function User({ alias }) {
    let user = await service.getUser({ alias })
    const component = Flex({ direction: "column", gap: "8px" },
        loadingCircle(Div({ key: 0, className: "post-container" })).addSignal("refresh", node => {
            node.while(async () => {
                let posts = await service.getPosts(post => post.user === user.id)
                node.nativeElement.innerHTML = ""
                node.append(...posts.map(post => Post(post)))
            })
        }).signal("refresh")
    ).addSignal("refresh", node => node.child(0).signal("refresh"))

    let interval = setInterval(() => {
        component.signal("refresh")
    }, 10000)

    return component
}
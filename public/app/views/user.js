// @ts-check
import Post from "../components/post.js"
import { Div } from "../components/generic.js"
import Flex from "../components/flex.js"
import { loadingCircle } from "../components/decorators.js"

import * as db from "../../fakedb.js"

export default async function User({ alias }) {
    const component = Flex({ direction: "column", gap: "8px" },
        loadingCircle(Div({ key: 0, className: "post-container" })).addSignal("refresh", node => {
            node.while(async () => {
                let posts = db.Posts.filter(p => p.user.alias === alias)
                node.nativeElement.innerHTML = ""
                node.append(...posts.map(Post))
            })
        }).signal("refresh")
    ).addSignal("refresh", node => node.child(0).signal("refresh"))

    let interval = setInterval(() => {
        component.signal("refresh")
    }, 60000)

    return component
}
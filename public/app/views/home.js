// @ts-check
import Post from "../components/post.js"
import { Div } from "../components/generic.js"
import { loadingCircle } from "../components/decorators.js"
import Flex from "../components/flex.js"
import Writer from "../components/writer.js"

import * as db from "../../fakedb.js"

export default async function Home() {
    const component = Flex({ direction: "column", gap: "8px" },
        Writer(),
        loadingCircle(Div({ key: 0, className: "post-container" })).addSignal("refresh", node => {
            node.while(async () => {
                let posts = db.Posts
                node.nativeElement.innerHTML = ""
                node.append(...posts.map(Post))
            })
        }).signal("refresh")
    ).addSignal("refresh", node => node.child(0).signal("refresh"))

    setInterval(() => component.signal("refresh"), 60000)

    return component
}
// @ts-check
import Post from "../components/post.js"
import { Div } from "../components/generic.js"
import * as service from "../services/db.js"
import { loadingCircle } from "../components/decorators.js"
import Flex from "../components/flex.js"

export default async function Home() {    
    const component = Flex({ direction: "column", gap: "8px" },
        loadingCircle(Div({ key: 0, className: "post-container" })).addSignal("refresh", node => {
            node.while(async () => {
                let posts = await service.getPosts(post => post)
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
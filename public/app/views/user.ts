import Doc, { useState } from "../../../modules/doc/module"
import Post from "../components/post"
import Flex from "../components/flex"
import { CurrentPosts as PostService } from "../services/posts"

export default async function User({ alias }) {
    let PostArray = useState<HTMLDivElement[]>([])
    PostService.unsubscribeAll()
    PostService.subscribe(posts => {
        let newPosts = posts.filter(post => post.value.user.alias === alias).map(({ value }) => Post(value))
        PostArray.value = newPosts.reverse()
    })
    const View = Flex({ direction: "column", gap: "8px" },
        Doc.createNode("div", { className: "post-container" }, PostArray)
    )
    return View
}
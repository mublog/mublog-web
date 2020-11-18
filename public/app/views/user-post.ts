import Doc from "../../../modules/doc/module"
import Flex from "../components/flex"
import { PostService } from "../services/posts"

export default async function UserPost({ alias, id }: { alias: string, id: string }) {
    PostService.value = PostService.value.filter(post => post.user.alias === alias && post.id === parseInt(id))
    const View = Flex({ direction: "column", gap: "8px" },
        Doc.createElement("div", { className: "post-container" }, 
            PostService.getCurrent()
        )
    )
    return View
}
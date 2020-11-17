import Doc from "../../../modules/doc/module"
import Flex from "../components/flex"
import { PostService } from "../services/posts"

export default async function User({ alias }: { alias: string }) {
    PostService.value = PostService.value.filter(post => post.user.alias === alias)
    const View = Flex({ direction: "column", gap: "8px" },
        Doc.createNode("div", { className: "post-container" }, PostService.getCurrent())
    )
    return View
}
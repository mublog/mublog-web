import Doc from "../../modules/doc/module"
import Flex from "../components/flex.component"
import PostService from "../services/post.service"

export default async function User({ alias }: { alias: string }) {
    PostService.value = PostService.value.filter(post => post.user.alias === alias)
    const View = Flex({ direction: "column", gap: "8px" },
        Doc.createElement("div", { className: "post-container" }, PostService.getCurrent())
    )
    return View
}
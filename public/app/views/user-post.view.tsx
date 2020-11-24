import { createElement } from "../../modules/doc/mod"
import * as µ from "../components/mu.component"
import PostService from "../services/post.service"
import UserService from "../services/user.service"
import Post from "../components/post.component"

export default function UserPostView({ alias, id }: { [key: string]: string }): HTMLDivElement {
  return <div id={"user-" + alias + "-" + id} for={{ of: PostService.getPosts(), do: Post }}></div>
}
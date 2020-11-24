import { createElement } from "../../modules/doc/mod"
import PostService from "../services/post.service"
import Post from "../components/post.component"

export default function UserView({ alias }: URLParams): HTMLDivElement {
  let posts = PostService.getPosts().filter(post => post.user.alias === alias)
  return <div for={{ of: posts, do: Post }}></div>
}
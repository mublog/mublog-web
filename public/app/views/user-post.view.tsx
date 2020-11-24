import { createElement } from "../../modules/doc/mod"
import PostService from "../services/post.service"
import Post from "../components/post.component"

export default function UserPostView({ alias, id }: URLParams): HTMLDivElement {
  let posts = PostService.getPosts().filter(post => post.id === parseInt(id))
  return <div for={{ of: posts, do: Post }}></div>
}
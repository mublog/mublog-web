import { createElement } from "../../modules/doc/mod"
import PostService from "../services/post.service"
import Post from "../components/post.component"

export default function UserPostView({ alias, id }: URLParams): HTMLDivElement {
  return (
    <div for={{
      of: PostService.getPosts(),
      do: Post,
      filter: p => p.id == id && p.user.alias === alias,
      sort: (a, b) => b.datePosted - a.datePosted
    }} />
  )
}
import { createElement } from "../../modules/doc/mod"
import PostService from "../services/post.service"
import Post from "../components/post.component"

export default function UserView({ alias }: URLParams): HTMLDivElement {
  return (
    <div for={{
      of: PostService.getPosts(),
      do: Post,
      sort: (a, b) => b.datePosted - a.datePosted,
      filter: p => p.user.alias === alias
    }} />
  )
}
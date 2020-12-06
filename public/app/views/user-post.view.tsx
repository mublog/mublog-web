import Doc from "../../mod/doc/mod"
import PostService from "../services/post.service"
import Post from "../components/post.component"

export default async function UserPostView({ alias, id }: URLParams) {
  return (
    <div for={{
      of: PostService.getPosts(),
      do: Post,
      filter: p => p.id == id && p.user.alias === alias,
      sort: (a, b) => b.datePosted - a.datePosted,
      limit: 1
    }} />
  ) as HTMLDivElement
}
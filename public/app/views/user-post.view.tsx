import Doc from "../../mod/doc/mod"
import * as PostService from "../services/post.service"
import Post from "../components/post.component"

export default async function UserPostView({ alias, id }: URLParams) {
  return (
    <div for={{
      of: PostService.Posts,
      do: Post,
      filter: p => p.id == id && p.user.alias === alias,
      limit: 1
    }} />
  ) as HTMLDivElement
}
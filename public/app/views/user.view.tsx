import Doc from "../../mod/doc/mod"
import PostService from "../services/post.service"
import Post from "../components/post.component"

export default async function UserView({ alias }: URLParams) {
  return (
    <div for={{
      of: PostService.getPosts(),
      do: Post,
      sort: (a, b) => b.datePosted - a.datePosted,
      filter: p => p.user.alias === alias
    }} />
  ) as HTMLDivElement
}
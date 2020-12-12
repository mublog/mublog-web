import Doc from "../../mod/doc/mod"
import * as PostService from "../services/post.service"
import Post from "../components/post.component"

export default async function UserView({ alias }: URLParams) {
  PostService.load(alias)
  return (
    <div for={{ of: PostService.Posts, do: Post, sort: (a, b) => b.datePosted - a.datePosted }} />
  ) as HTMLDivElement
}
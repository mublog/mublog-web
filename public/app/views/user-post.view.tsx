import Doc from "../../mod/doc/mod"
import * as PostService from "../services/post.service"
import Post from "../components/post.component"

export default async function UserPostView({ alias, id }: URLParams) {
  const post = PostService.localById(parseInt(id))
  return (
    <Post
      id={post.id}
      user={post.user}
      textContent={post.textContent}
      liked={post.liked}
      likeAmount={post.likeAmount}
      datePosted={post.datePosted}
      dateEdited={post.dateEdited}
      showComments
    />
  ) as HTMLDivElement
}
import { createElement, onInterval } from "../../modules/doc/mod"
import PostService from "../services/post.service"
import UserService from "../services/user.service"
import Post from "../components/post.component"

export default function PresentationView(): HTMLDivElement {
  const View = (
    <div for={{
      of: PostService.getPosts(),
      do: Post,
      sort: (a, b) => b.datePosted - a.datePosted
    }} />
  )

  if (UserService.isUser.get()) {
    onInterval(() => {
      PostService.add({
        id: Math.round(Math.random() * 10000000),
        textContent: "test",
        user: UserService.currentUser(),
        datePosted: Date.now(),
        dateEdited: Date.now(),
        likeAmount: 0
      })
    }, 500)
  }

  return View
}
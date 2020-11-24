import { createElement, onInterval } from "../../modules/doc/mod"
import PostService from "../services/post.service"
import UserService from "../services/user.service"
import Post from "../components/post.component"

export default function PresentationView(): HTMLDivElement {
  PostService.getPosts().clear()
  const View = <div for={{ of: PostService.getPosts(), do: Post }} />

  if (UserService.isUser.get()) {
    onInterval(() => {
      PostService.add({
        id: Math.round(Math.random() * 10000000),
        textContent: "test",
        user: UserService.currentUser(),
        datePost: Date.now(),
        likeAmount: 0,
        likeNames: []
      })
    }, 500)
  }
  else {
    PostService.add({
      id: Math.round(Math.random() * 10000000),
      textContent: "Logge dich ein, um dich zuspamen zu lassen :3",
      user: {
        alias: "admin",
        name: "Ilja"
      },
      datePost: Date.now(),
      likeAmount: 0,
      likeNames: []
    })
  }

  return View
}
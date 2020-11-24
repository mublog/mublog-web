import { createElement, useRef } from "../../modules/doc/mod"
import * as µ from "../components/mu.component"
import PostService from "../services/post.service"
import UserService from "../services/user.service"
import Post from "../components/post.component"

export default function HomeView(): HTMLDivElement {
  const WriterRef = useRef<µ.WriterElement>()
  PostService.getPosts().clear()

  return (
    <div styles={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <form onsubmit={tryPost} if={UserService.isUser}>
        <µ.Writer ref={WriterRef}>
          <div styles={{ display: "flex", gap: "8px" }}>
            <µ.Button onclick={getValues}>Submit</µ.Button>
          </div>
        </µ.Writer>
      </form>
      <div for={{ of: PostService.getPosts(), do: Post }}></div>
    </div>
  )

  function getValues() {
    return WriterRef.get().getValues()
  }

  function tryPost(event: Event) {
    event.preventDefault()
    if (!UserService.isUser.get()) {
      return false
    }
    const values = getValues()
    if (values && values.raw) {
      PostService.add({
        id: Math.round(Math.random() * 10000000),
        textContent: values.raw,
        user: UserService.currentUser(),
        datePost: Date.now(),
        likeAmount: 0,
        likeNames: []
      })
      WriterRef.get().textArea.get().value = ""
    }
  }
}
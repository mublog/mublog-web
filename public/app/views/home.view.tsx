import { createElement, useRef } from "../../modules/doc/mod"
import * as µ from "../components/mu.component"
import i18n from "../../lang/de_DE.json"
import PostService from "../services/post.service"
import UserService from "../services/user.service"
import Post from "../components/post.component"
import NotificationService from "../services/notification.service"

export default function HomeView(): HTMLDivElement {
  const WriterRef = useRef<µ.WriterElement>()

  return (
    <div styles={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <form onsubmit={tryPost} if={UserService.isUser}>
        <µ.Writer ref={WriterRef}>
          <div styles={{ display: "flex", gap: "8px" }}>
            <µ.Button onclick={getValues}>{i18n.send}</µ.Button>
          </div>
        </µ.Writer>
      </form>
      <div for={{
        of: PostService.getPosts(),
        do: Post,
        sort: (a, b) => b.datePosted - a.datePosted
      }} />
    </div>
  )

  function getValues() {
    return WriterRef.get().getValues()
  }

  function tryPost(event: Event) {
    event.preventDefault()
    if (!UserService.isUser.get()) {
      NotificationService.push(null, i18n.authError)
      return false
    }
    const values = getValues()
    if (values && values.raw) {
      PostService.add({
        id: Math.round(Math.random() * 10000000),
        textContent: values.raw,
        user: UserService.currentUser(),
        datePosted: Date.now(),
        dateEdited: Date.now(),
        likeAmount: 0
      })
      WriterRef.get().clear()
    }
    else {
      NotificationService.push(null, i18n.messageCriteriaError)
    }
  }
}
import Doc, { useRef } from "../../mod/doc/mod"
import * as µ from "../components/mu.component"
import i18n from "../../lang/de_DE.json"
import * as PostService from "../services/post.service"
import UserService from "../services/user.service"
import Post from "../components/post.component"
import NotificationService from "../services/notification.service"

export default async function HomeView() {
  PostService.load()

  return (
    <div styles={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div if={UserService.isUser}>
        <HomeWriter />
      </div>
      <div for={{
        of: PostService.Posts,
        do: Post,
        sort: (a, b) => b.datePosted - a.datePosted
      }} />
    </div>
  ) as HTMLDivElement
}

function HomeWriter() {
  const WriterRef = useRef<µ.WriterElement>()

  return (
    <form onsubmit={tryPost}>
      <µ.Writer ref={WriterRef}>
        <div styles={{ display: "flex", gap: "8px" }}>
          <µ.Button type="submit">{i18n.send}</µ.Button>
          <µ.Button type="button">{i18n.uploadImage}</µ.Button>
        </div>
      </µ.Writer>
    </form>
  ) as HTMLFormElement

  function getValues() {
    return WriterRef.current.getValues()
  }

  async function tryPost(event: Event) {
    event.preventDefault()
    if (!UserService.isUser.value()) {
      NotificationService.push(null, i18n.authError)
      return false
    }
    const values = getValues()

    if (!values?.raw) {
      return NotificationService.push(null, i18n.messageCriteriaError)
    }

    let success = await PostService.add(values.raw)
    if (success) {
      WriterRef.current.clear()
      PostService.load()
    }
  }
}
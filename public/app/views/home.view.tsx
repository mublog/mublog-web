import Doc, { reference } from "../../mod/doc/mod"
import * as µ from "../components/mu.component"
import i18n from "../../lang/de_DE.json"
import { up } from "../helpers/up-down"
import { Uploaded, Uploads } from "../services/generic.service"
import * as PostService from "../services/post.service"
import * as UserService from "../services/user.service"
import { MAX_FILE_SIZE } from "../config/settings"
import Post from "../components/post.component"
import * as NotificationService from "../services/notification.service"

export default async function HomeView() {
  await PostService.load()

  return (
    <div styles={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div if={UserService.isUser}>
        <HomeWriter />
      </div>
      <div for={{ of: PostService.Posts, do: Post, sort: PostService.sort, limit: 5 }} />
    </div>
  ) as HTMLDivElement
}

function HomeWriter() {
  const WriterRef = reference<µ.WriterElement>()

  return (
    <form onsubmit={tryPost} destroy={() => Uploads.set([])}>
      <µ.Writer ref={WriterRef}>
        <div styles={{ display: "flex", gap: "8px" }}>
          <µ.Button type="submit">{i18n.send}</µ.Button>
          <µ.Button type="button" onclick={uploadImage}>{i18n.uploadImage}</µ.Button>
        </div>
        <div if={Uploaded}>
          <µ.Seperator />
          <div
            styles={{ display: "flex", flexDirection: "column-reverse", gap: "8px" }}
            for={{
              of: Uploads,
              do: (props: UploadItem) => (
                <µ.UploadItemElement key={props.key} preview={props.preview} fileName={props.fileName} />
              )
            }}
          />
        </div>
      </µ.Writer>
    </form>
  ) as HTMLFormElement


  async function uploadImage() {
    let [file, error] = await up({ accept: "image/*", readAs: "BinaryString", maxSize: MAX_FILE_SIZE })
    if (error) {
      return NotificationService.push(null, i18n.followingError.replace("$e", error.message))
    }
    if (!file.type.startsWith("image/")) {
      return NotificationService.push(null, i18n.unsupportedFileType.replace("$t", file.type))
    }
    if (!file.data) return NotificationService.push(null, i18n.errorOnUpload)
    let guid = await PostService.addMedia(file)
    if (!guid) return NotificationService.push(null, i18n.errorOnUpload)
    Uploads.update($ => $.push({ key: guid, fileName: file.name, preview: PostService.API_MEDIA + guid }))
  }

  function getValues() {
    return { text: WriterRef.current.getValues()?.raw }
  }

  async function tryPost(event: Event) {
    event.preventDefault()
    if (!UserService.isUser.value()) {
      NotificationService.push(null, i18n.authError)
      return false
    }
    const values = getValues()
    if (!values.text) return NotificationService.push(null, i18n.messageCriteriaError)
    let success = await PostService.add(values.text)
    if (success) {
      WriterRef.current.clear()
      Uploads.set([])
      PostService.load()
    }
  }
}
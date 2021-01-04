import Doc, { reference } from "../../mod/doc/mod"
import * as µ from "../components/mu.component"
import i18n from "../../lang/de_DE.json"
import * as http from "../services/http.service"
import { up } from "../helpers/up-down"
import { Uploaded, Uploads } from "../services/generic.service"
import * as PostService from "../services/post.service"
import * as UserService from "../services/user.service"
import Post from "../components/post.component"
import * as NotificationService from "../services/notification.service"
import { base64ToBlob } from "../helpers/base64-to-blob"
import { UUIDv4 } from "../helpers/uuid-v4"

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
    let [file, error] = await up({ accept: "image/*", readAs: "DataURL", maxSize: 5242880 })
    let [blob] = await base64ToBlob(file.data)

    if (error) {
      return NotificationService.push(null, i18n.followingError.replace("$e", error.message))
    }
    if (!file.type.startsWith("image/")) {
      return NotificationService.push(null, i18n.unsupportedFileType.replace("$t", file.type))
    }

    Uploads.update(uploads => {
      uploads.push({
        key: UUIDv4(),
        fileName: file.name,
        preview: file.data,
        data: blob
      })
      /* 
        This is how the upload works, theoretically
        let formData = new FormData()
        formData.append("file", blob, file.name)
        http.post("http://localhost:5000/api/v1/media", formData, {
          init: { headers: { "Content-Type": null } }
        })
      */
    })
  }

  function getValues() {
    return {
      text: WriterRef.current.getValues().raw,
      // images: Uploads.value().map(({ fileData, fileName }) => ({ name: fileName, data: fileData }))
    }
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
import Doc, { useRef } from "../../mod/doc/mod"
import * as µ from "../components/mu.component"
import i18n from "../../lang/de_DE.json"
import { up } from "../helpers/up-down"
import * as http from "../services/http.service"
import { Uploaded, Uploads } from "../services/generic.service"
import * as PostService from "../services/post.service"
import * as UserService from "../services/user.service"
import Post from "../components/post.component"
import NotificationService from "../services/notification.service"
import { createKey } from "../../mod/doc/src/helper"
import { base64ToBlob } from "../helpers/base64-to-blob"

export default async function HomeView() {
  await PostService.load()

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
          <µ.Button type="button" onclick={uploadImage}>{i18n.uploadImage}</µ.Button>
        </div>
        <div if={Uploaded}>
          <µ.Seperator />
          <div
            styles={{ display: "flex", flexDirection: "column-reverse", gap: "8px" }}
            for={{
              of: Uploads,
              do: (props: UploadItem<string>) => (
                <µ.UploadItemElement key={props.key} fileData={props.fileData} fileName={props.fileName} />
              )
            }}
          />
        </div>
      </µ.Writer>
    </form>
  ) as HTMLFormElement

  async function uploadImage() {
    let [file, error] = await up({ accept: "image/*", readAs: "DataURL" })
    if (error) return NotificationService.push(null, error.message)
    if (!file.type.startsWith("image/")) return NotificationService.push(null, file.type)
    Uploads.update(images => images.push({ key: createKey(), fileName: file.name, fileData: file.data }))
    const [blob] = await base64ToBlob(file.data)
    const formData = new FormData()
    formData.append("file", blob, file.name)

    let [data, res] = await http.post<any>("/api/v1/media", formData, {
      init: {
        body: formData,
        method: "POST",
        headers: {
          Authorize: "Bearer " + localStorage.getItem("token")
        }
      }
    })
    console.log({ data, res })
  }

  function getValues() {
    return {
      text: WriterRef.current.getValues().raw,
      images: Uploads.value().map(({ fileData, fileName }) => ({ name: fileName, data: fileData }))
    }
  }

  async function tryPost(event: Event) {
    event.preventDefault()
    if (!UserService.isUser.value()) {
      NotificationService.push(null, i18n.authError)
      return false
    }
    const values = getValues()

    if (!values.text) {
      return NotificationService.push(null, i18n.messageCriteriaError)
    }

    let success = await PostService.add(values.text)
    if (success) {
      WriterRef.current.clear()
      Uploads.set([])
      PostService.load()
    }
  }
}
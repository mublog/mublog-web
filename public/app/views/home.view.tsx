import Doc, { reference } from "../../mod/doc/mod"
import * as µ from "../components/mu.component"
import i18n from "../../lang/de_DE.json"
import { up } from "../helpers/up-down"
import { Uploaded, Uploads } from "../services/generic.service"
import * as PostService from "../services/post.service"
import * as UserService from "../services/user.service"
import Post from "../components/post.component"
import * as NotificationService from "../services/notification.service"
import { createKey } from "../../mod/doc/src/helper"
import { base64ToBlob } from "../helpers/base64-to-blob"

import * as http from "../services/http.service"

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
        sort: (a, b) => b.datePosted - a.datePosted,
        limit: 5
      }} />
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
              do: (props: UploadItem<string>) => (
                <µ.UploadItemElement key={props.key} fileData={props.fileData} fileName={props.fileName} />
              )
            }}
          />
        </div>
      </µ.Writer>
    </form>
  ) as HTMLFormElement

  function createGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  async function uploadImage() {
    let [file, error] = await up({ accept: "image/*", readAs: "DataURL", maxSize: 5242880 })
    if (error) return NotificationService.push(null, i18n.followingError.replace("$e", error.message))
    if (!file.type.startsWith("image/")) return NotificationService.push(null, i18n.unsupportedFileType.replace("$t", file.type))

    Uploads.update(uploads => uploads.push({ key: createKey(), fileName: file.name, fileData: file.data }))
    const [blob] = await base64ToBlob(file.data)

    const formData = new FormData()
    formData.append(createGuid(), blob, file.name)

    let res = await fetch("/api/v1/media", {
      body: formData,
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorize": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlsanVzaGthQGxvY2FsaG9zdCIsInN1YiI6ImlsanVzaGthIiwianRpIjoiZTgxYjA0MTMtMzViMS00YzYxLWIxYmYtNjU4ZThkNmVhMjczIiwibmJmIjoxNjA3NzEzOTE4LCJleHAiOjE2MDgzMTg3MTgsImlzcyI6Imh0dHA6Ly9ibG9nLmV4YW1wbGUuY29tIiwiYXVkIjoiaHR0cDovL2Jsb2cuZXhhbXBsZS5jb20ifQ.8md-bTVwU5RuaJsga30SvijYWwfSqFbLijgFb_SZj4M"
      }
    })
    console.log({ res })
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

    if (!values.text) return NotificationService.push(null, i18n.messageCriteriaError)

    let success = await PostService.add(values.text)
    if (success) {
      WriterRef.current.clear()
      Uploads.set([])
      PostService.load()
    }
  }
}
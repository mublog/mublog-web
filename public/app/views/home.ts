import Doc, { useState } from "../../../modules/doc/module"
import Flex from "../components/flex"
import Writer, { WriterElement } from "../components/writer"
import Notifications from "../components/notifications"
import { PostService } from "../services/posts"
import { UserService } from "../services/user"
import i18n from "../../lang/de_DE.json"

export default function Home() {
    if (!UserService.isLoggedIn()) {
        return GuestHome()
    }
    return UserHome()
}

const fakeWait = () => new Promise(res => setTimeout(res, 500))

function UserHome() {
    const View = Flex({ direction: "column", gap: "8px" },
        Writer({ className: "writer-home" }),
        Doc.createNode("div", { className: "post-container" }, PostService.getCurrent())
    )

    const ViewWriterRef = Doc.query<WriterElement>(View, ".writer-home")

    ViewWriterRef.onSubmit(async event => {
        if (ViewWriterRef.rawText.length < 4) {
            ViewWriterRef.classList.remove("loading-circle")
            Notifications.push(null, i18n.messageTooShort)
            return
        }
        if (ViewWriterRef.rawText.length > 1024) {
            Notifications.push(null, i18n.messageTooLong)
            return
        }
        ViewWriterRef.classList.add("loading-circle")
        await fakeWait()
        PostService.insert(ViewWriterRef.rawText)
        ViewWriterRef.reset()
        ViewWriterRef.classList.remove("loading-circle")
    })

    return View
}

function GuestHome() {
    const View = Flex({ direction: "column", gap: "8px" },
        Doc.createNode("div", { className: "post-container" }, PostService.getCurrent())
    )
    return View
}
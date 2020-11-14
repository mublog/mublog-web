// @ts-check
import Doc, { useState } from "../../../modules/doc/module.js"
import Post from "../components/post.js"
import Flex from "../components/flex.js"
import Writer from "../components/writer.js"

import * as db from "../services/fakedb.js"

export default async function Home() {
    let PostArray = useState([])
    db.Posts.subscribe(posts => PostArray.value = posts.map(Post))

    const View = Flex({ direction: "column", gap: "8px" },
        Writer(),
        Doc.createNode("div", { className: "post-container" }, PostArray)
    )
    return View
}
import { useState, useMixin } from "../../../modules/doc/module"
import type { Post as PostType } from "../definitions/post"
import Post, { PostElement } from "../components/post"
import { UserService, Users } from "./user"
import { State } from "../../../modules/doc/src/types"

let currentPosts = useState([] as PostElement[])
export const PostService = useMixin(useState([] as PostType[]), {
    getCurrent(): State<PostElement[]> {
        return currentPosts
    },
    sort(): void {
        PostService.update(posts => posts.sort((p1, p2) => p2.datePosted - p1.datePosted))
    },
    load(post: PostType) {
        PostService.update(posts => posts.push(post))
    },
    insert(textContent: string) {
        if (!UserService.isLoggedIn()) {
            return false
        }
        PostService.update(posts => {
            posts.push({
                id: Date.now(),
                user: Users.value.find(user => user.alias === UserService.getAlias()),
                textContent,
                likeAmount: 0,
                likes: [],
                commentAmount: 0,
                comments: [],
                datePosted: Date.now(),
                dateEdited: Date.now()
            })
        })
        return true
    },
    reset() {
        PostService.value = []
        PostService.unsubscribeAll()
    }
})

PostService.subscribe(posts => currentPosts.value = posts.map(post => Post(post)).reverse())
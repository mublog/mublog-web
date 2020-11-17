import { useState, useMixin } from "../../../modules/doc/module"
import type { Types } from "../../../modules/doc/module"
import mockUsers from "./mock_users"
import mockPosts from "./mock_posts"
import type { Post as PostType } from "../definitions/post"
import { User, Users } from "./user"

const PostState: Types.State<Types.State<PostType>[]> = useState([])

export const CurrentPosts = useMixin(PostState, {
    insert(textContent: string) {
        if (!User.isLoggedIn()) {
            return false
        }
        CurrentPosts.update(posts => {
            posts.push(useState({
                id: Date.now(),
                user: Users.value.find(user => user.alias === User.value.alias),
                textContent,
                likeAmount: 0,
                likes: [],
                commentAmount: 0,
                comments: [],
                datePosted: Date.now(),
                dateEdited: Date.now()
            }))
        })
        return true
    },
    find(predicate: (post: Types.State<PostType>) => any) {
        return CurrentPosts.value.filter(predicate)
    },
    findOne(predicate: (post: Types.State<PostType>) => any) {
        return CurrentPosts.value.find(predicate)
    },
    has(postId: number) {
        return CurrentPosts.value.findIndex(post => post.value.id === postId) >= 0
    },
    init() {
        CurrentPosts.value = mockPosts.map(post => useState({
            id: post.id,
            user: mockUsers.find(user => user.alias === post.user),
            commentAmount: post.commentAmount,
            comments: [],
            dateEdited: post.dateEdited,
            datePosted: post.datePosted,
            likeAmount: post.likeAmount,
            likes: [],
            textContent: post.textContent
        }))
    }
})

CurrentPosts.init()
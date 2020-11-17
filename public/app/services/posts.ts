import { useState, useMixin } from "../../../modules/doc/module"
import type { Types } from "../../../modules/doc/module"
import mockUsers from "./mock_users"
import mockPosts from "./mock_posts"
import type { Post as PostType } from "../definitions/post"
import { UserService, Users } from "./user"

const ActivePostState: Types.State<PostType> = useState(undefined)
export const ActivePost = useMixin(ActivePostState, {
    reset() {
        ActivePostState.value = undefined
        ActivePostState.unsubscribeAll()
    }
})

const PostsState: Types.State<Types.State<PostType>[]> = useState([])
export const CurrentPosts = useMixin(PostsState, {
    sort() {
        CurrentPosts.update(posts => {
            posts.sort((p1, p2) => p2.value.datePosted - p1.value.datePosted)
        })
    },
    load(post: PostType) {
        CurrentPosts.update(posts => posts.push(useState(post)))
    },
    insert(textContent: string) {
        if (!UserService.isLoggedIn()) {
            return false
        }
        CurrentPosts.update(posts => {
            posts.push(useState({
                id: Date.now(),
                user: Users.value.find(user => user.alias === UserService.getAlias()),
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
    },
    reset() {
        CurrentPosts.value = []
        CurrentPosts.unsubscribeAll()
    }
})

CurrentPosts.init()
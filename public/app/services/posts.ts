import { useState, useMixin } from "../../../modules/doc/module"
import type { Post as PostType } from "../definitions/post"
import Post, { PostElement } from "../components/post"
import { UserService, Users } from "./user"
import { State } from "../../../modules/doc/src/types"

export const PostService = useMixin(useState([] as PostType[]), {
    _sort: undefined as (p1: PostType, p2: PostType) => any,
    _limit: undefined as number,
    _currentPosts: useState([] as PostElement[]),
    
    getCurrent(): State<PostElement[]> {
        return PostService._currentPosts
    },
    newestFirst() {
        PostService.sort((p1, p2) => p2.datePosted - p1.datePosted)
    },
    limit(amount: number) {
        PostService._limit = amount
    },
    sort(sortCallback: (p1: PostType, p2: PostType) => any): void {
        PostService._sort = sortCallback
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
                user: Users.findOne(UserService.getAlias()),
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

PostService.subscribe(posts => {
    if (PostService._sort) {
        posts = posts.sort(PostService._sort)
    }
    if (PostService._limit) {
        posts.length = PostService._limit
    }
    PostService._currentPosts.value = posts.map(Post)
})
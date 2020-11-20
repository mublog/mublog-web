import { useState, useMixin } from "../../modules/doc/module"
import type { State } from "../../modules/doc/module"
import type { Post as PostType, PostAPI } from "../definitions/post"
import PostComponent, { PostElement } from "../components/post.component"
import { UserService, Users } from "./user.service"

export const PostService = useMixin(useState([] as PostType[]), {
    _sort: undefined as (p1: PostType, p2: PostType) => any,
    _limit: undefined as number,
    _elements: useState([] as PostElement[]),
    _map: new Map() as Map<number, PostElement>,

    like(id: number) {
        if (!UserService.isLoggedIn()) {
            return
        }
        let post = PostService.get(id).value
        post.States.likes.update(list => {
            let index = list.indexOf(UserService.getAlias())
            index >= 0 ? list.splice(index, 1) : list.push(UserService.getAlias())
            post.States.likeAmount.value = list.length
        })
    },

    get(id: number): PostElement {
        return PostService._map.get(id)
    },

    set(id: number, el: PostElement) {
        PostService._map.set(id, el)
    },

    getCurrent(): State<PostElement[]> {
        return PostService._elements
    },

    newestFirst() {
        PostService.sort((p1, p2) => p2.datePosted - p1.datePosted)
    },

    limit(amount: number) {
        PostService._limit = amount
    },

    sort(sortFn: (p1: PostType, p2: PostType) => any): void {
        PostService._sort = sortFn
    },

    load(post: PostAPI) {
        PostService.update(posts => {
            posts.push({
                id: post.id,
                user: post.user,
                textContent: post.textContent,
                likeAmount: useState(post.likeAmount),
                likes: useState([]),
                commentAmount: useState(post.commentAmount),
                comments: useState([]),
                datePosted: post.datePosted,
                dateEdited: useState(post.dateEdited)
            })
        })
    },

    insert(textContent: string) {
        if (!UserService.isLoggedIn()) {
            return false
        }
        let newPost = {
            id: Date.now(),
            user: Users.findOne(UserService.getAlias()),
            textContent,
            likeAmount: 0,
            commentAmount: 0,
            datePosted: Date.now(),
            dateEdited: Date.now()
        }
        PostService.load(newPost)
        return true
    }
})

PostService.subscribe(posts => {
    if (PostService._sort) {
        posts = posts.sort(PostService._sort)
    }
    if (PostService._limit) {
        posts.length = PostService._limit
    }
    PostService._elements.value.forEach(val => val.unsubscribeAll())
    PostService._elements.value = posts.map(post => {
        let el = PostComponent(post)
        PostService.set(post.id, el)
        return el
    })
})

export default PostService
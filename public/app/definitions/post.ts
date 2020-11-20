import type { User } from "./user"
import type { State } from "../../modules/doc/module"

export interface PostAPI {
    id: number
    user: User
    textContent: string
    likeAmount: number
    commentAmount: number
    datePosted: number
    dateEdited: number
}

export interface Post {
    id: number
    user: User
    textContent: string
    likeAmount: State<number>
    likes: State<string[]>
    commentAmount: State<number>
    comments: State<number[]>
    datePosted: number
    dateEdited: State<number>
}
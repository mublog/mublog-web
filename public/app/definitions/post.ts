import type { User } from "./user"

export interface Post {
    id: number
    user: User
    textContent: string
    likeAmount: number
    likes: string[]
    commentAmount: number
    comments: number[]
    datePosted: number
    dateEdited: number
}

export interface InitPost {
    id: number
    user: string
    textContent: string
    likeAmount: number
    commentAmount: number
    datePosted: number
    dateEdited: number
}
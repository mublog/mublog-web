declare interface PostModel {
  id: number
  textContent: string
  user: User
  datePosted: number
  dateEdited: number
  likeAmount: number
  liked: boolean,
  showComments?: boolean
}

declare interface CommentModel {
  id: number
  textContent: string
  user: User
  datePosted: number
  dateEdited: number
}
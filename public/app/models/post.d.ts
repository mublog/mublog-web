interface PostModel {
  id: number
  textContent: string
  user: User
  datePosted: number
  dateEdited: number
  commentsAmount: number
  likeAmount: number
  liked: boolean,
  showComments?: boolean
}

interface CommentModel {
  id: number
  textContent: string
  user: User
  datePosted: number
}
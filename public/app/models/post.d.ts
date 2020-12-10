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
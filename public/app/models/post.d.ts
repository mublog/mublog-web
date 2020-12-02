declare interface PostModel {
  id: number
  textContent: string
  user: User
  datePosted: number
  dateEdited: number
  likeAmount: number
  likedByUser?: boolean
}
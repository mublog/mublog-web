declare interface PostModel {
  id: number
  textContent: string
  user: {
    alias: string
    name: string
    imageUrl?: string
  }
  datePosted: number
  dateEdited: number
  likeAmount: number
  likedByUser?: boolean
}
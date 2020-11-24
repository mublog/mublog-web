declare interface PostModel {
  id: number
  textContent: string
  user: {
    alias: string
    name: string
  }
  datePosted: number
  dateEdited: number
  likeAmount: number
  likeNames: string[]
}
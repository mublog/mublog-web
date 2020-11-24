import { useStore } from "../../modules/doc/mod"

export default PostService()

export interface Post {
  id: number
  textContent: string
  user: {
    alias: string
    name: string
  }
  datePost: number
  likeAmount: number
  likeNames: string[]
}

function PostService() {
  const posts = useStore<Post>([])
  const pub = { getPosts, add }

  function getPosts() {
    return posts
  }

  function add(post: Post) {
    posts.add(post)
  }

  return pub
}
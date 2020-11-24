import { useStore } from "../../modules/doc/mod"

export default PostService()

function PostService() {
  const posts = useStore<PostModel>([])
  const pub = { getPosts, add, hasPost }

  function getPosts() {
    return posts
  }

  function hasPost(id: number) {
    return !!posts.find(post => post.id === id)
  }

  function add(post: PostModel) {
    posts.add(post)
  }

  return pub
}
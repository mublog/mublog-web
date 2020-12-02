import { useState } from "../../modules/doc/mod"

export default PostService()

function PostService() {
  const posts = useState<PostModel[]>([])
  const pub = { getPosts, add, hasPost, update }

  setInterval(() => {
    posts.get().forEach(post => {
      post.likeAmount += Math.round(Math.random() * 10)
    })
  }, 10000)

  function getPosts() {
    return posts
  }

  function hasPost(id: number) {
    return !!posts.get().find(post => post.id === id)
  }

  function update(fn: Update<PostModel[]>) {
    posts.update(fn)
  }

  function add(post: PostModel) {
    posts.update(posts => [...posts, post])
    localStorage.setItem("posts", JSON.stringify(posts.get()))
    return pub
  }

  return pub
}
import { useStore } from "../../modules/doc/mod"

export default PostService()

function PostService() {
  let local: any = localStorage.getItem("posts")
  if (local) {
    local = JSON.parse(local)
  }
  else {
    local = []
  }

  const posts = useStore<PostModel>(local)
  const pub = { getPosts, add, hasPost, notify }

  function notify() {
    posts.notify()
  }

  setInterval(() => {
    posts.get().forEach(post => {
      post.likeAmount += Math.round(Math.random() * 10)
    })
    notify()
  }, 10000)

  function getPosts() {
    return posts.get()
  }

  function hasPost(id: number) {
    return !!posts.get().find(post => post.id === id)
  }

  function add(post: PostModel) {
    posts.add(post)
    localStorage.setItem("posts", JSON.stringify(posts.get()))
    notify()
    return pub
  }

  return pub
}
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
  const pub = { getPosts, add, hasPost }

  setInterval(() => {
    posts.get().forEach(post => {
      post.likeAmount += Math.round(Math.random() * 10)
    })
  }, 10000)

  function getPosts() {
    return posts
  }

  function hasPost(id: number) {
    return !!posts.find(post => post.id === id)
  }

  function add(post: PostModel) {
    posts.add(post)
    localStorage.setItem("posts", JSON.stringify(posts.get()))
    return pub
  }

  return pub
}
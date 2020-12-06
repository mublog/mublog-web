import { useState } from "../../mod/doc/mod"
import * as http from "./http.service"
import UserService from "./user.service"

export default PostService()

function PostService() {
  const API_URL = "http://localhost:5000/api/v1/posts"
  const API_POSTS_ID = (id: number) => API_URL + "/" + id
  const API_POSTS_LIKE = (id: number) => API_URL + "/like/" + id

  const posts = useState<PostModel[]>([])
  const pub = { getPosts, add, hasPost, load, like, localById }

  async function load(page: number = 1, size: number = 100) {
    let [postRes, res] = await http.get<PostsResponse>(API_URL + `?page=${page}&size=${size}`)
    if (res.status === 200) {
      posts.set(postRes.data)
    }
    else {
      // oh no
    }
  }

  function getPosts() {
    return posts
  }

  async function getPost(id: number) {
    let [wrapper, res] = await http.get<ResponseWrapper<PostModel>>(API_POSTS_ID(id))
    if (res.status === 200) return wrapper.data
  }

  async function hasPost(id: number) {
    return !!(await getPost(id))
  }

  async function add(content: string) {
    const body = JSON.stringify({ content })
    let [_, res] = await http.post<ResponseWrapper<null>>(API_URL, body)
    return res.status === 200
  }

  async function like(id: number) {
    let post = localById(id)
    let method = post.liked ? "del" : "post"
    let [_, res] = await http[method]<ResponseWrapper<null>>(API_POSTS_LIKE(id), "{}")

    if (res.status === 200) {
      let [w2, r2] = await http.get<ResponseWrapper<PostModel>>(API_POSTS_ID(id))
      if (r2.status === 200) {
        patchOne(id, w2.data)
        return true
      }
    }
    return false
  }

  function patchOne(id: number, newData: PostModel) {
    let post = localById(id)
    if (post) for (let key in newData) post[key] = newData[key]
  }

  function localById(id: number) {
    return posts.value().find(post => post.id === id)
  }

  return pub
}
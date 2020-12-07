import { useState } from "../../mod/doc/mod"
import * as http from "./http.service"

const API_URL = "http://localhost:5000/api/v1/posts"
const API_POSTS_ID = API_URL + "/"
const API_POSTS_LIKE = API_URL + "/like/"

export const Posts = useState<PostModel[]>([])

export async function load(page: number = 1, size: number = 100) {
  let [postRes, res] = await http.get<ResponseWrapper<PostModel[]>>(API_URL + `?page=${page}&size=${size}`)
  if (res.status !== 200) return
  Posts.set(postRes.data)
}

export async function getPost(id: number) {
  let [wrapper, res] = await http.get<ResponseWrapper<PostModel>>(API_POSTS_ID + id)
  if (res.status === 200) return wrapper.data
}

export async function hasPost(id: number) {
  return !!(await getPost(id))
}

export async function add(content: string) {
  const body = JSON.stringify({ content })
  let [_, res] = await http.post<ResponseWrapper<null>>(API_URL, body)
  return res.status === 200
}

export async function like(id: number) {
  let post = localById(id)
  let method = post.liked ? "del" : "post"
  let [_, res] = await http[method]<ResponseWrapper<null>>(API_POSTS_LIKE + id, "{}")
  if (res.status !== 200) return false
  let [w2, r2] = await http.get<ResponseWrapper<PostModel>>(API_POSTS_ID + id)
  if (r2.status !== 200) return false
  patchOne(id, w2.data)
  return true
}

export function patchOne(id: number, newData: PostModel) {
  let post = localById(id)
  if (post) for (let key in newData) post[key] = newData[key]
}

export function localById(id: number) {
  return Posts.value().find(post => post.id === id)
}
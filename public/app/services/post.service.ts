import { observable } from "../../mod/doc/mod"
import * as NotificationService from "./notification.service"
import * as http from "./http.service"
import i18n from "../../lang/de_DE.json"

const URL = ""
const API_VERSION = 1
const API_URL = `${URL}/api/v${API_VERSION}/posts`
const API_POSTS_ID = API_URL + "/"
const API_POSTS_LIKE = API_URL + "/like/"

export const Posts = observable<PostModel[]>([])

export const localById = (postId: number) => Posts.value().find(post => post.id === postId)
export const hasPost = async (postId: number) => !!(await getPost(postId))

export const sort = (a: PostModel, b: PostModel) => b.datePosted - a.datePosted

export async function load(username: string = null, page: number = 1, size: number = 50) {
  let url: string[] = []
  if (username) url.push(`Username=${username}`)
  if (page) url.push(`Page=${page}`)
  if (size) url.push(`Size=${size}`)
  let query = url.join("&")
  if (query.length > 0) query = "?" + query
  let [postRes, res] = await http.get<ResponseWrapper<PostModel[]>>(API_URL + query)
  if (![200, 204].includes(res?.status)) return
  if (postRes?.data) Posts.set(postRes.data)
}

export async function getPost(postId: number) {
  let [wrapper, res] = await http.get<ResponseWrapper<PostModel>>(API_POSTS_ID + postId)
  if ([200, 204].includes(res?.status)) {
    if (!localById(wrapper.data.id)) {
      Posts.value().push(wrapper.data)
    }
    return wrapper.data
  }
}

export async function add(content: string) {
  const body = JSON.stringify({ content })
  let [_, res] = await http.post<ResponseWrapper<null>>(API_URL, body)
  return res?.status === 200
}

export async function del(postId: number) {
  let [_, res] = await http.del<ResponseWrapper<null>>(API_POSTS_ID + postId)
  if ([200, 204].includes(res?.status)) {
    NotificationService.push(null, i18n.deletePostSuccess)
    Posts.update(list => {
      const idx = list.findIndex(post => post.id === postId)
      if (idx >= 0) list.splice(idx, 1)
    })
  }
  else {
    NotificationService.push(null, i18n.deletePostFailed)
  }
  return res?.status === 204
}

export async function like(postId: number) {
  let post = localById(postId)
  let method = post.liked ? "del" : "post"
  let [_, res] = await http[method]<ResponseWrapper<null>>(API_POSTS_LIKE + postId, "{}")
  if (res.status !== 200) return false
  let [w2, r2] = await http.get<ResponseWrapper<PostModel>>(API_POSTS_ID + postId)
  if (r2.status !== 200) return false
  patchOne(postId, w2.data)
  return true
}

export function patchOne(id: number, newData: PostModel) {
  let post = localById(id)
  if (post) for (let key in newData) post[key] = newData[key]
}

export async function loadComments(id: number): Promise<CommentModel[]> {
  let [wrapper] = await http.get<ResponseWrapper<CommentModel[]>>(API_URL + "/" + id + "/comments")
  return wrapper?.data?.length ? wrapper.data : []
}

export async function addComment(id: number, content: string) {
  let body = JSON.stringify({ content })
  let [wrapper, res] = await http.post<ResponseWrapper<CommentModel[]>>(API_URL + "/" + id + "/comments", body)
  return res?.status === 200
}

export async function delComment(id: number) {
  let [wrapper, res] = await http.del<ResponseWrapper<null>>(API_URL + "/" + id + "/comments")
  return res?.status === 200
}
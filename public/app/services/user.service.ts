import { observable } from "../../mod/doc/mod"
import i18n from "../../lang/de_DE.json"
import * as NotificationService from "./notification.service"
import * as service from "./generic.service"
import * as http from "./http.service"
import * as cfg from "../config/settings"
import jwtDecode from "jwt-decode"

const API_VERSION = 1
const API_URL = `http://localhost:5000/api/v${API_VERSION}`
const API_ACCOUNT = "accounts"
const API_USER = API_URL + "/users/"
const API_FOLLOW = API_USER + "follow/"
const API_LOGIN = API_URL + `/${API_ACCOUNT}/login`
const API_REGISTER = API_URL + `/${API_ACCOUNT}/register`
const API_TOKEN = API_URL + `/${API_ACCOUNT}/token`
const API_DISPLAY_NAME = API_URL + `/${API_ACCOUNT}/displayname`
const API_EMAIL = API_URL + `/${API_ACCOUNT}/email`
const API_PASSWORD = API_URL + `/${API_ACCOUNT}/password`

export const isUser = observable(false)
export const isGuest = observable(true)

let _currentUser = {} as User

export const isLoggedIn = isUser.value
export const currentUser = () => isLoggedIn() ? _currentUser : null
export const hasUser = async (alias: string) => !!(await getUser(alias))

export async function logout() {
  isUser.set(false)
  localStorage.removeItem("token")
  NotificationService.push(null, i18n.logoutMessage, cfg.notification)
  service.activateRoute("/login")
}

export async function login({ alias, password }) {
  let body = JSON.stringify({ username: alias, password })
  let [token, res] = await http.post<ResponseWrapper<{ accessToken: string }>>(API_LOGIN, body)
  if (res?.status === 200 && token?.data?.accessToken) {
    setToken(token.data.accessToken)
    isUser.set(true)
    NotificationService.push(null, i18n.loginSuccessMessage, cfg.notification)
  }
  else {
    isUser.set(false)
    NotificationService.push(null, i18n.loginFailedMessage, cfg.notification)
  }
}

export async function follow(username: string) {
  let [_, res] = await http.post<ResponseWrapper<null>>(API_FOLLOW + username)
  return res.status === 2000
}

export async function unfollow(username: string) {
  let [_, res] = await http.del<ResponseWrapper<null>>(API_FOLLOW + username)
  return res.status === 2000
}

export async function followers(username: string) {
  return 0
}

export async function following(username: string) {
  return 0
}

export async function patchDisplayName(displayName: string) {
  let body = JSON.stringify({ displayName })
  let [_, res] = await http.patch<ResponseWrapper<null>>(API_DISPLAY_NAME, body)
  return res.status === 200
}

export async function patchEmail(email: string) {
  let body = JSON.stringify({ email })
  let [_, res] = await http.patch<ResponseWrapper<null>>(API_EMAIL, body)
  return res.status === 200
}

export async function patchPassword(currentPassword: string, newPassword: string) {
  let body = JSON.stringify({ currentPassword, newPassword })
  let [_, res] = await http.patch<ResponseWrapper<null>>(API_PASSWORD, body)
  return res.status === 200
}

export async function deleteAccount() {
  let [wrapper, res] = await http.del<ResponseWrapper<null>>(API_PASSWORD, "{}")
  return res.status === 200
}

export async function refreshToken() {
  let token = getToken()
  if (token) {
    const diff = ((token.exp) - Math.round(Date.now() / 1000)) / 3600
    if (diff <= 24) {
      let [wrapper, res] = await http.get<ResponseWrapper<{ accessToken: string }>>(API_TOKEN)
      if (wrapper.data?.accessToken) {
        setToken(wrapper.data?.accessToken)
      }
      isUser.set(res.status === 200)
    }
    else {
      isUser.set(true)
    }
  }
  else {
    isUser.set(false)
  }
}

export async function register({ alias, displayName, email, password }) {
  let body = JSON.stringify({ email, username: alias, password, displayName })
  let [_, res] = await http.post<ResponseWrapper<null>>(API_REGISTER, body)
  if (res.status === 200) {
    NotificationService.push(null, i18n.registerSuccess, cfg.notification)
    service.activateRoute("/login")
  }
  else {
    NotificationService.push(null, i18n.registerFailed, cfg.notification)
  }
}

isUser.subscribe(async state => {
  isGuest.set(state ? false : true)
  if (state === false) _currentUser = {} as User
  if (state === true) {
    const alias = getToken()?.sub
    _currentUser = await getUser(alias)
  }
})

function setToken(accessToken: string) {
  localStorage.setItem("token", accessToken)
}

export async function getUser(username: string) {
  let [wrapper, res] = await http.get<ResponseWrapper<User>>(API_USER + username)
  if (res.status !== 200) return
  return wrapper.data
}

function getToken(): JWToken {
  const token = localStorage.getItem("token")
  if (token) {
    return jwtDecode(token)
  }
}

refreshToken()
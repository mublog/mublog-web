import { observable } from "../../mod/doc/mod"
import i18n from "../../lang/de_DE.json"
import NotificationService from "./notification.service"
import * as service from "./generic.service"
import * as http from "./http.service"
import * as cfg from "../config/settings"
import jwtDecode from "jwt-decode"

const API_URL = "http://localhost:5000/api/v1"
const API_LOGIN = API_URL + "/accounts/login"
const API_REGISTER = API_URL + "/accounts/register"
const API_USER = API_URL + "/users/"

export const isUser = observable(false)
export const isGuest = observable(true)

let _currentUser = {} as User

export const isLoggedIn = () => isUser.value()
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
  isGuest.set(state ? (false) : (true))
  if (state === false) _currentUser = {} as User
  if (state === true) _currentUser = await getUser(getAlias())
})

function setToken(accessToken: string) {
  localStorage.setItem("token", accessToken)
}

export async function getUser(username: string) {
  let [wrapper, res] = await http.get<ResponseWrapper<User>>(API_USER + username)
  if (res.status !== 200) return
  return wrapper.data
}

function getAlias() {
  const token = localStorage.getItem("token")
  if (token) {
    let jwt: { sub: string } = jwtDecode(token)
    if (jwt && jwt.sub) return jwt.sub
  }
}

if (getAlias())
  isUser.set(true)
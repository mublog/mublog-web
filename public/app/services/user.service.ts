import { useState } from "../../mod/doc/mod"
import i18n from "../../lang/de_DE.json"
import NotificationService from "./notification.service"
import * as service from "./generic.service"
import * as http from "./http.service"
import * as cfg from "../config/settings"
import jwtDecode from "jwt-decode"

export default UserService()

function UserService() {
  const API_URL = "http://localhost:5000/api/v1"
  const API_LOGIN = API_URL + "/accounts/login"
  const API_REGISTER = API_URL + "/accounts/register"
  const API_USER = API_URL + "/users/"

  const isUser = useState(false)
  const isGuest = useState(true)

  let _currentUser = {} as User

  const pub = { isUser, isGuest, logout, login, register, currentUser, hasUser, isLoggedIn, getUser }

  function isLoggedIn() {
    return isUser.value()
  }

  function currentUser() {
    if (isUser.value()) return _currentUser
  }

  async function hasUser(alias: string) {
    return !!(await getUser(alias))
  }

  async function logout() {
    isUser.set(false)
    localStorage.removeItem("token")
    NotificationService.push(null, i18n.logoutMessage, cfg.notification)
    service.activateRoute("/login")
    return pub
  }

  async function login({ alias, password }) {
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
    return pub
  }

  async function register({ alias, displayName, email, password }) {
    let body = JSON.stringify({ email, username: alias, password, displayName })
    let [_, res] = await http.post<ResponseWrapper<null>>(API_REGISTER, body)
    if (res.status === 200) {
      NotificationService.push(null, i18n.registerSuccess, cfg.notification)
      service.activateRoute("/login")
    }
    else {
      NotificationService.push(null, i18n.registerFailed, cfg.notification)
    }
    return pub
  }

  isUser.subscribe(async state => {
    isGuest.set(state ? false : true)
    if (state === false) for (let key in _currentUser) _currentUser[key] = undefined
    if (state === true) _currentUser = await getUser(getAlias())
  })

  function setToken(accessToken: string) {
    localStorage.setItem("token", accessToken)
  }

  async function getUser(alias: string) {
    let [wrapper, res] = await http.get<ResponseWrapper<User>>(API_USER + alias)
    if (res.status !== 200) return
    return wrapper.data
  }

  function getAlias() {
    if (localStorage.getItem("token")) {
      let jwt: { sub: string } = jwtDecode(localStorage.getItem("token"))
      if (jwt && jwt.sub) {
        return jwt.sub
      }
    }
  }

  if (getAlias()) isUser.set(true)

  return pub
}

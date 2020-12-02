import { useState } from "../../modules/doc/mod"
import i18n from "../../lang/de_DE.json"
import NotificationService from "./notification.service"
import * as service from "./generic.service"
import * as http from "./http.service"
import * as cfg from "../config/settings"
import jwtDecode from "jwt-decode"

const httpOptions = (): HttpOptions => ({
  contentType: "json",
  init: {
    cache: "no-cache",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Authorize": "Bearer " + getToken()
    }
  }
})

export default UserService()

function UserService() {
  const API_URL = "http://localhost:5000/api/v1"
  const isUser = useState(false)
  const isGuest = useState(true)
  let userAlias: string

  const pub = { isUser, isGuest, logout, login, register, currentUser, hasUser, isLoggedIn }

  function isLoggedIn(): boolean {
    return !!getToken() && isUser.get()
  }

  function currentUser() {
    if (isUser.get()) {
      return {
        alias: userAlias
      }
    }
  }

  function hasUser(alias: string) {
    return true
  }

  async function logout() {
    isUser.set(false)
    delToken()
    NotificationService.push(null, i18n.logoutMessage, cfg.notification)
    service.activateRoute("/login")
    return pub
  }

  async function login({ alias, password }) {
    let body = JSON.stringify({ username: alias, password })
    let [token, res] = await http.post<ResponseWrapper<{ accessToken: string }>>(API_URL + "/auth/login", body, httpOptions())
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
    let [_, res] = await http.post<ResponseWrapper<null>>(API_URL + "/auth/register", body, httpOptions())
    if (res.status === 200) {
      NotificationService.push(null, i18n.registerSuccess, cfg.notification)
      service.activateRoute("/login")
    }
    else {
      NotificationService.push(null, i18n.registerFailed, cfg.notification)
    }
    return pub
  }

  isUser.subscribe(state => {
    isGuest.set(state ? false : true)
    userAlias = getAlias()
  })

  if (getAlias()) {
    isUser.set(true)
  }

  return pub
}

function getToken() {
  return localStorage.getItem("token")
}

function setToken(accessToken: string) {
  localStorage.setItem("token", accessToken)
}

function delToken() {
  localStorage.removeItem("token")
}

function getAlias() {
  if (getToken()) {
    let jwt: { sub: string } = jwtDecode(getToken())
    if (jwt && jwt.sub) {
      return jwt.sub
    }
  }
}

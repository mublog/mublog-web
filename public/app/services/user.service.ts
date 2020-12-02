import { useState } from "../../modules/doc/mod"
import i18n from "../../lang/de_DE.json"
import NotificationService from "./notification.service"
import * as service from "./generic.service"
import * as http from "./http.service"

import * as cfg from "../config/settings"

const users = [
  { alias: "iljushka", name: "Ilja", password: "password" }
]

const httpOptions: HttpOptions = {
  contentType: "json",
  init: {
    cache: "no-cache",
    mode: "cors",
    headers: {
      "Content-Type": "application/json"
    }
  }
}

export default UserService()

function UserService() {
  const API_URL = "http://localhost:5000/api/v1"
  const isUser = useState(false)
  const isGuest = useState(true)
  let userAlias: string
  let userName: string
  let userImageUrl: string

  const pub = { isUser, isGuest, logout, login, register, currentUser, hasUser }

  function currentUser() {
    if (isUser.get()) {
      return {
        alias: userAlias,
        name: userName,
        imageUrl: userImageUrl
      }
    }
  }

  function hasUser(alias: string) {
    return !!users.find(user => user.alias === alias)
  }

  async function logout() {
    isUser.set(false)
    deleteToken()
    NotificationService.push(null, i18n.logoutMessage, cfg.notification)
    service.activateRoute("/login")
    return pub
  }

  async function login({ alias, password }) {
    let body = JSON.stringify({ username: alias, password })
    let [token, result] = await http.post<{ accessToken: string }>(API_URL + "/auth/login", body, httpOptions)

    if (token?.accessToken) {
      setToken(token.accessToken)
    }

    /**
     * this will be replaced when the real login works
     */
    let success = users.find(user => user.alias === alias && user.password === password)
    if (success) {
      isUser.set(true)
      userAlias = alias
      userName = success.name
      NotificationService.push(null, i18n.loginSuccessMessage, cfg.notification)
    }
    else {
      isUser.set(false)
      NotificationService.push(null, i18n.loginFailedMessage, cfg.notification)
    }
    return pub
  }

  async function register({ alias, name, password }) {
    let success = !users.find(user => user.alias === alias && user.name === name)
    if (success) {
      users.push({ alias, name, password })
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
    if (isGuest.get()) {
      userAlias = undefined
      userName = undefined
      userImageUrl = undefined
    }
  })

  return pub
}

function getToken() {
  return localStorage.getItem("token")
}

function setToken(accessToken: string) {
  localStorage.setItem("token", accessToken)
}

function deleteToken() {
  localStorage.removeItem("token")
}
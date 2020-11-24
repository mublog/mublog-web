import { useState } from "../../modules/doc/mod"
import i18n from "../../lang/de_DE.json"
import NotificationService from "./notification.service"
import * as service from "../services/generic.service"
import * as cfg from "../config/settings"

const users = [
  { alias: "iljushka", name: "Ilja", password: "password" }
]

export default UserService()

function UserService() {
  const isUser = useState(false)
  const isGuest = useState(true)
  const userImageUrl = useState("")
  let userAlias: string
  let userName: string

  const pub = { isUser, isGuest, userImageUrl, logout, login, register, currentUser }

  function currentUser() {
    if (isUser.get()) {
      return {
        alias: userAlias,
        name: userName
      }
    }
  }

  async function logout() {
    isUser.set(false)
    NotificationService.push(null, i18n.logoutMessage, cfg.notification)
    service.activateRoute("/login")
    return pub
  }

  async function login({ alias, password }) {
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

  async function register() {
    return pub
  }

  isUser.subscribe(state => isGuest.set(state ? false : true))

  return pub
}
import { createElement } from "../../modules/doc/mod"
import UserService from "../services/user.service"
import i18n from "../../lang/de_DE.json"
import * as µ from "./mu.component"

export default function Navigation() {
  return (
    <nav id="navigation" className="box">
      <µ.Header>{i18n.navigation}</µ.Header>
      <div className="list">
        <a href="/">{i18n.home}</a>
        <a href="/presentation">{i18n.presentation}</a>
        <a if={UserService.isGuest} href="/login">{i18n.login}</a>
        <a if={UserService.isGuest} href="/register">{i18n.register}</a>
        <a if={UserService.isUser} onclick={UserService.logout}>{i18n.logout}</a>
      </div>
    </nav>
  ) as HTMLElement
}
import Doc from "../../mod/doc/mod"
import UserService from "../services/user.service"
import i18n from "../../lang/de_DE.json"
import * as µ from "./mu.component"

export default function Navigation() {
  return (
    <µ.Box id="navigation">
      <µ.Header>{i18n.navigation}</µ.Header>
      <div className="list">
        <a href="/">{i18n.home}</a>
        <a if={UserService.isGuest} href="/login">{i18n.login}</a>
        <a if={UserService.isGuest} href="/register">{i18n.register}</a>
        <a if={UserService.isUser} href="/settings">{i18n.settings}</a>
        <a if={UserService.isUser} onclick={UserService.logout}>{i18n.logout}</a>
      </div>
    </µ.Box>
  ) as HTMLElement
}
import { createElement, useRef } from "../../modules/doc/mod"
import i18n from "../../lang/de_DE.json"
import * as µ from "../components/mu.component"
import UserService from "../services/user.service"
import NotificationService from "../services/notification.service"

export default function RegisterView(): HTMLDivElement {
  const InputAlias = useRef<HTMLInputElement>()
  const InputName = useRef<HTMLInputElement>()
  const InputPasswords = [useRef<HTMLInputElement>(), useRef<HTMLInputElement>()]

  return (
    <div id="register" className="box">
      <µ.Header>{i18n.createAccount}</µ.Header>
      <form onsubmit={tryRegister}>
        <div styles={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div styles={{ display: "flex", flexDirection: "row", gap: "8px" }}>
            <µ.Label labelText={i18n.alias}>
              <µ.Input ref={InputAlias} type="text" placeholder={i18n.alias} required="true" />
            </µ.Label>
            <µ.Label labelText={i18n.name}>
              <µ.Input ref={InputName} type="text" placeholder={i18n.name} required="true" />
            </µ.Label>
          </div>
          <div styles={{ display: "flex", flexDirection: "row", gap: "8px" }}>
            <µ.Label labelText={i18n.password}>
              <µ.Input ref={InputPasswords[0]} type="password" placeholder="********" required="true" />
            </µ.Label>
            <µ.Label labelText={i18n.passwordReEnter}>
              <µ.Input ref={InputPasswords[1]} type="password" placeholder="********" required="true" />
            </µ.Label>
          </div>
          <µ.Footer>
            <div styles={{ display: "flex", flexDirection: "row", gap: "8px" }}>
              <µ.Button type="submit">{i18n.register}</µ.Button>
              <a href="/login">
                <µ.Button type="button">{i18n.alreadyAccount}</µ.Button>
              </a>
            </div>
          </µ.Footer>
        </div>
      </form>
    </div>
  )

  function getValues() {
    return {
      alias: InputAlias.get().value,
      passwords: [InputPasswords[0].get().value, InputPasswords[1].get().value]
    }
  }

  async function tryRegister(event: Event) {
    event.preventDefault()
    console.log(getValues())
    UserService.register()
    NotificationService.push(null, "Du hast versucht dich einzuloggen :D")
  }
}
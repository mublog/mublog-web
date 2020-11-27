import { createElement, useRef } from "../../modules/doc/mod"
import i18n from "../../lang/de_DE.json"
import * as µ from "../components/mu.component"
import UserService from "../services/user.service"
import NotificationService from "../services/notification.service"

export default async function RegisterView() {
  const InputAlias = useRef<HTMLInputElement>()
  const InputName = useRef<HTMLInputElement>()
  const InputPasswords = [useRef<HTMLInputElement>(), useRef<HTMLInputElement>()]

  return (
    <µ.Box id="register">
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
    </µ.Box>
  ) as HTMLDivElement

  function getValues() {
    return {
      alias: InputAlias.current.value,
      name: InputName.current.value,
      passwords: [InputPasswords[0].current.value, InputPasswords[1].current.value]
    }
  }

  function equalPasswords() {
    return [...new Set(getValues().passwords)].length !== 1
  }

  async function tryRegister(event: Event) {
    event.preventDefault()
    let values = getValues()
    if (equalPasswords()) {
      NotificationService.push(null, i18n.passwordsNotSame)
      return
    }

    UserService.register({
      alias: values.alias,
      name: values.name,
      password: values.passwords[0]
    })
  }
}
import Doc, { reference } from "../../mod/doc/mod"
import i18n from "../../lang/de_DE.json"
import * as µ from "../components/mu.component"
import * as UserService from "../services/user.service"
import * as NotificationService from "../services/notification.service"

export default async function RegisterView() {
  const InputAlias = reference<HTMLInputElement>()
  const InputName = reference<HTMLInputElement>()
  const InputEmail = reference<HTMLInputElement>()
  const InputPasswords = [reference<HTMLInputElement>(), reference<HTMLInputElement>()]

  return (
    <µ.Box id="register">
      <µ.Header>{i18n.createAccount}</µ.Header>
      <form onsubmit={tryRegister}>
        <div styles={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div styles={{ display: "flex", flexDirection: "row", gap: "8px" }}>
            <µ.Label labelText={i18n.username}>
              <µ.Input name="alias" ref={InputAlias} type="text" placeholder={i18n.username} required="true" />
            </µ.Label>
            <µ.Label labelText={i18n.name}>
              <µ.Input name="name" ref={InputName} type="text" placeholder={i18n.name} required="true" />
            </µ.Label>
          </div>
          <µ.Label labelText={i18n.email}>
            <µ.Input name="email" ref={InputEmail} type="email" placeholder="your@email.com" required="true" />
          </µ.Label>
          <div styles={{ display: "flex", flexDirection: "row", gap: "8px" }}>
            <µ.Label labelText={i18n.password}>
              <µ.Input name="password" ref={InputPasswords[0]} type="password" placeholder="********" required="true" />
            </µ.Label>
            <µ.Label labelText={i18n.passwordReEnter}>
              <µ.Input name="password" ref={InputPasswords[1]} type="password" placeholder="********" required="true" />
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
      email: InputEmail.current.value,
      passwords: [InputPasswords[0].current.value, InputPasswords[1].current.value]
    }
  }

  function equalPasswords() {
    return [...new Set(getValues().passwords)].length === 1
  }

  async function tryRegister(event: Event) {
    event.preventDefault()
    let values = getValues()
    if (!equalPasswords()) return NotificationService.push(null, i18n.passwordsNotSame)

    UserService.register({
      alias: values.alias,
      displayName: values.name,
      email: values.email,
      password: values.passwords[0]
    })
  }
}
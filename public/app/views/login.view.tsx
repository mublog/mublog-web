import Doc, { useRef } from "../../mod/doc/mod"
import i18n from "../../lang/de_DE.json"
import * as services from "../services/generic.service"
import * as µ from "../components/mu.component"
import UserService from "../services/user.service"

export default async function LoginView() {
  const InputAlias = useRef<HTMLInputElement>()
  const InputPassword = useRef<HTMLInputElement>()

  return (
    <µ.Box id="login">
      <µ.Header>{i18n.enterAccount}</µ.Header>
      <form onsubmit={tryLogin}>
        <div styles={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div styles={{ display: "flex", gap: "8px" }}>
            <µ.Label labelText={i18n.alias}>
              <µ.Input ref={InputAlias} type="text" placeholder={i18n.alias} required="true" />
            </µ.Label>
            <µ.Label labelText={i18n.password}>
              <µ.Input ref={InputPassword} type="password" placeholder="********" required="true" />
            </µ.Label>
          </div>
          <µ.Footer>
            <div styles={{ display: "flex", flexDirection: "row", gap: "8px" }}>
              <µ.Button type="submit">{i18n.login}</µ.Button>
              <a href="/register">
                <µ.Button type="button">{i18n.noAccount}</µ.Button>
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
      password: InputPassword.current.value
    }
  }

  async function tryLogin(event: Event) {
    event.preventDefault()
    if ((await UserService.login(getValues())).isUser.value()) {
      services.activateRoute("/")
    }
  }
}
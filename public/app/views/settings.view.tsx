import Doc, { observable, reference } from "../../mod/doc/mod"
import i18n from "../../lang/de_DE.json"
import i18nProgressiveWebAppText from "../../lang/de_DE.progressiveWebAppText"
import * as µ from "../components/mu.component"
import * as InstallService from "../services/install.service"

export default async function SettingsView() {
  const Name = {
    changed: observable(false),
    reference: reference<HTMLInputElement>()
  }
  const Email = {
    changed: observable(false),
    reference: reference<HTMLInputElement>()
  }
  const Passwords = {
    changed: observable(false),
    references: [reference<HTMLInputElement>(), reference<HTMLInputElement>()]
  }

  return (
    <div id="settings" styles={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <µ.Box>
        <µ.Header>{i18n.userSettings}</µ.Header>

        <div styles={{ display: "flex", flexDirection: "row", gap: "8px" }}>
          <µ.Label labelText={i18n.name}>
            <µ.Input ref={Name.reference} type="text" placeholder={i18n.name} />
          </µ.Label>

          <µ.Label labelText={i18n.email}>
            <µ.Input ref={Email.reference} type="text" placeholder={i18n.email} />
          </µ.Label>
        </div>

        <div styles={{ display: "flex", flexDirection: "row", gap: "8px" }}>
          <µ.Label labelText={i18n.password}>
            <µ.Input name="password" ref={Passwords.references[0]} type="password" placeholder="********" />
          </µ.Label>
          <µ.Label labelText={i18n.passwordReEnter}>
            <µ.Input name="passwosrd" ref={Passwords.references[1]} type="password" placeholder="********" />
          </µ.Label>
        </div>

        <µ.Footer>
          <µ.Button>{i18n.save}</µ.Button>
        </µ.Footer>
      </µ.Box>

      <µ.Box>
        <µ.Header>{i18n.deleteAccount}</µ.Header>
        <µ.Box>{i18n.deleteAccountInfo}</µ.Box>
        <µ.Footer>
          <µ.Button>{i18n.deleteAccount}</µ.Button>
        </µ.Footer>
      </µ.Box>

      <µ.Box>
        <µ.Header>{i18n.progressiveWebApp}</µ.Header>
        <µ.Box>{i18nProgressiveWebAppText}</µ.Box>
        <µ.Footer>
          <µ.Button if={InstallService.isNotInstalled} onclick={InstallService.install}>
            {i18n.installApp}
          </µ.Button>
          <µ.Button if={InstallService.isInstalled} onclick={InstallService.uninstall}>
            {i18n.uninstallApp}
          </µ.Button>
        </µ.Footer>
      </µ.Box>
    </div>
  ) as HTMLDivElement
}
import Doc, { observable, reference, portal } from "../../mod/doc/mod"
import i18n from "../../lang/de_DE.json"
import i18nProgressiveWebAppText from "../../lang/de_DE.progressiveWebAppText"
import * as µ from "../components/mu.component"
import * as InstallService from "../services/install.service"
import * as UserService from "../services/user.service"

export default async function SettingsView() {
  return (
    <div id="settings" styles={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <ChangeNameView />
      <ChangePasswordView />
      <DeleteAccountView />
      <ProgressiveView />
    </div>
  ) as HTMLDivElement
}

function ChangeNameView() {
  const Name = {
    changed: observable(false),
    reference: reference<HTMLInputElement>()
  }

  return (
    <µ.Box>
      <µ.Header>{i18n.changeName}</µ.Header>
      <µ.Label labelText={i18n.name}>
        <µ.Input
          ref={Name.reference}
          type="text"
          placeholder={i18n.name}
          oninput={() => Name.changed.set(!!Name.reference.current.value)}
        />
      </µ.Label>
      <div if={Name.changed}>
        <µ.Footer>
          <µ.Button type="button" onclick={changeNameEvent}>
            {i18n.save}
          </µ.Button>
        </µ.Footer>
      </div>
    </µ.Box>
  ) as HTMLDivElement

  async function changeNameEvent() {
    let success = await UserService.patchDisplayName(Name.reference.current.value)
    if (success) Name.reference.current.value = ""
  }
}

function ProgressiveView() {
  return (
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
  ) as HTMLDivElement
}

function DeleteAccountView() {
  const DeleteAccountPortal = portal(DeleteAccount)
  return (
    <µ.Box>
      <µ.Header>{i18n.deleteAccount}</µ.Header>
      <µ.Box>{i18n.deleteAccountInfo}</µ.Box>
      <µ.Footer>
        <µ.Button
          type="button"
          onclick={DeleteAccountPortal.open}
        >
          {i18n.deleteAccount}
        </µ.Button>
      </µ.Footer>
    </µ.Box>
  ) as HTMLDivElement

  function DeleteAccount() {
    return (
      <µ.Menu onmouseleave={DeleteAccountPortal.close}>
        <µ.Header>{i18n.deleteAccountSure}</µ.Header>
        <µ.MenuItem onclick={UserService.deleteAccount}>
          {i18n.continue}
        </µ.MenuItem>
      </µ.Menu>
    ) as HTMLUListElement
  }
}

function ChangePasswordView() {
  const Passwords = {
    changed: observable(false),
    changable: observable(false),
    references: [reference<HTMLInputElement>(), reference<HTMLInputElement>(), reference<HTMLInputElement>()]
  }

  return (
    <µ.Box>
      <µ.Header>{i18n.changePasswordTitle}</µ.Header>
      <µ.Label labelText={i18n.currentPassword}>
        <µ.Input name="password" ref={Passwords.references[0]} type="password" placeholder="********" oninput={passwordEvent} />
      </µ.Label>
      <div styles={{ display: "flex", flexDirection: "row", gap: "8px" }}>
        <µ.Label labelText={i18n.newPassword}>
          <µ.Input name="password" ref={Passwords.references[1]} type="password" placeholder="********" oninput={passwordEvent} />
        </µ.Label>
        <µ.Label labelText={i18n.newPasswordReEnter}>
          <µ.Input name="password" ref={Passwords.references[2]} type="password" placeholder="********" oninput={passwordEvent} />
        </µ.Label>
      </div>
      <div if={Passwords.changable}>
        <µ.Footer>
          <µ.Button
            type="button"
            onclick={updatePassword}
          >
            {i18n.save}
          </µ.Button>
        </µ.Footer>
      </div>
    </µ.Box>
  ) as HTMLDivElement

  function passwordEvent(event: KeyboardEvent) {
    Passwords.changed.set(!!Passwords.references[0].current.value)
    Passwords.changable.set(
      Passwords.references[0].current.value &&
      Passwords.references[1].current.value &&
      Passwords.references[2].current.value &&
      (Passwords.references[1].current.value === Passwords.references[2].current.value)
    )
  }

  async function updatePassword(event: MouseEvent) {
    let success = await UserService.patchPassword(
      Passwords.references[0].current.value,
      Passwords.references[1].current.value
    )
    if (success) {
      Passwords.references.forEach(ref => ref.current.value = "")
    }
  }
}
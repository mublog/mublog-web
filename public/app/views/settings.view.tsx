import Doc from "../../mod/doc/mod"
import i18n from "../../lang/de_DE.json"
import * as µ from "../components/mu.component"
import InstallService from "../services/install.service"

export default async function SettingsView() {
  return (
    <div id="settings" styles={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <µ.Box>
        <µ.Header>{i18n.userSettings}</µ.Header>
      </µ.Box>
      <µ.Box>
        <µ.Header>{i18n.general}</µ.Header>
        <div styles={{ display: "flex", gap: "8px", alignItems: "baseline" }}>
          <µ.Button if={InstallService.isNotInstalled} onclick={InstallService.install}>
            {i18n.installApp}
          </µ.Button>
          <µ.Button if={InstallService.isInstalled} onclick={InstallService.uninstall}>
            {i18n.uninstallApp}
          </µ.Button>
          <span if={InstallService.isInstalled}>({i18n.isInstalled})</span>
        </div>
      </µ.Box>
    </div>
  ) as HTMLDivElement
}
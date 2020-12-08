import Doc from "../../mod/doc/mod"
import i18n from "../../lang/de_DE.json"
import i18nProgressiveWebAppText from "../../lang/de_DE.progressiveWebAppText"
import * as µ from "../components/mu.component"
import * as InstallService from "../services/install.service"

export default async function SettingsView() {
  return (
    <div id="settings" styles={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <µ.Box>
        <µ.Header>{i18n.userSettings}</µ.Header>
      </µ.Box>

      <µ.Box>
        <µ.Header>{i18n.progressiveWebApp}</µ.Header>
        <µ.Box>
          {i18nProgressiveWebAppText}
        </µ.Box>
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
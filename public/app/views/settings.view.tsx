import Doc from "../../modules/doc/mod"
import i18n from "../../lang/de_DE.json"
import * as µ from "../components/mu.component"
import ServiceWorkerService from "../services/service-worker.service"

export default async function SettingsView() {
  return (
    <div id="settings" styles={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <µ.Box>
        <µ.Header>{i18n.userSettings}</µ.Header>
      </µ.Box>
      <µ.Box>
        <µ.Header>{i18n.general}</µ.Header>
        <div styles={{ display: "flex", gap: "8px", alignItems: "baseline" }}>
          <µ.Button if={ServiceWorkerService.isNotInstalled} onclick={ServiceWorkerService.install}>
            {i18n.installApp}
          </µ.Button>
          <µ.Button if={ServiceWorkerService.isInstalled} onclick={ServiceWorkerService.uninstall}>
            {i18n.uninstallApp}
          </µ.Button>
          <span if={ServiceWorkerService.isInstalled}>({i18n.isInstalled})</span>
        </div>
      </µ.Box>
    </div>
  ) as HTMLDivElement
}
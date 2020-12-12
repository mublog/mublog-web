import Doc, { reference, onEvent } from "../../mod/doc/mod"
import * as µ from "../components/mu.component"

declare interface NotificationOption {
  position?: "top" | "top-left" | "top-right" | "bottom" | "bottom-left" | "bottom-right"
  timeout?: number
  removeOnClick?: boolean
}

const BottomRight = reference<HTMLElement>()

export function push(title: string, message: string, options: NotificationOption = {
  removeOnClick: false,
  timeout: 5000
}) {
  const wrapper = BottomRight.current
  if (wrapper) {
    wrapper.appendChild(<Notification title={title} message={message} options={options} />)
    wrapper.scrollBy(0, wrapper.scrollHeight)
  }
}

function Notification({ title, message, options }: { title: string; message: string; options: NotificationOption }) {
  const View = (
    <µ.Box className="notification" arrow="bottom-right">
      <µ.Header if={!!title}>
        {title || ""}
      </µ.Header>
      <div className="notification-message">
        {message}
      </div>
    </µ.Box>
  ) as HTMLDivElement

  if (options.timeout) setTimeout(() => View.remove(), options.timeout)
  if (options.removeOnClick) onEvent(View, "click", () => View.remove())
  return View
}

document.body.appendChild((
  <div id="notifications">
    <div ref={BottomRight} className="notification-wrapper" />
  </div>
))
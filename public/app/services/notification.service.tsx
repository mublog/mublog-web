import { createElement, onClick, useRef } from "../../modules/doc/mod"
import * as µ from "../components/mu.component"

declare interface NotificationOption {
  position?: "top" | "top-left" | "top-right" | "bottom" | "bottom-left" | "bottom-right"
  timeout?: number
  removeOnClick?: boolean
}

export default NotificationService()

function NotificationService() {
  const pub = { push }
  const bottomRight = useRef<HTMLElement>()

  const View: HTMLDivElement = (
    <div id="notifications">
      <div ref={bottomRight} className="notification-wrapper" />
    </div>
  )

  function push(title: string, message: string, options: NotificationOption = {
    removeOnClick: false,
    timeout: 5000
  }) {
    const wrapper = bottomRight.get()
    if (wrapper) {
      wrapper.appendChild(<Notification title={title} message={message} options={options} />)
      wrapper.scrollBy(0, wrapper.scrollHeight)
    }
  }

  document.body.appendChild(View)
  return pub
}

function Notification({ title, message, options }: { title: string; message: string; options: NotificationOption }) {
  const View = (
    <div className="notification box">
      <µ.Header if={!!title}>
        {title || ""}
      </µ.Header>
      <div className="notification-message">
        {message}
      </div>
    </div>
  ) as HTMLDivElement

  if (options.timeout) {
    setTimeout(() => View.remove(), options.timeout)
  }
  if (options.removeOnClick) {
    onClick(() => View.remove())
  }
  return View
}
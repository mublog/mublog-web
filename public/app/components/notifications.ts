import Doc, { useStyles, useMixin, unmount, useEvent } from "../../../modules/doc/module"
import Box, { Arrow, Header } from "./box"

export interface NotificationOption {
    timeout?: number
    removeOnClick?: boolean
}

function NotificationItem(
    title: string, 
    message: string, 
    options: NotificationOption = { timeout: 5000 }
) {
    let { timeout, removeOnClick } = options
    const View = Box({ className: "notification" },
        Arrow("bottom-right"),
        Header({ className: "notification-title" }, title || ""),
        message
    )
    useStyles(View, { animation: "notification-slide 250ms ease-in-out 0ms 1 normal none" })
    const Mixin = useMixin(View, {
        enableRemoveOnClick() {
            useEvent(Mixin, "click", () => unmount(Mixin))
        },
        hideTitle() {
            useStyles(Mixin.querySelector(".notification-title"), { display: "none" })
        },
        slideOut(delay) {
            let newDelay = delay > 250 ? delay - 250 : 0
            setTimeout(() => useStyles(Mixin, {
                animation: `notification-slide 250ms ease-in-out ${newDelay}ms 1 reverse none`
            }), newDelay)
            setTimeout(() => unmount(Mixin), delay)
        }
    })
    if (!title) {
        Mixin.hideTitle()
    }
    if (timeout) {
        Mixin.slideOut(timeout)
    }
    if (removeOnClick) {
        Mixin.enableRemoveOnClick()
    }
    return Mixin
}

const Notifications = (function() {
    const View = Doc.createNode("div", { id: "notifications" }, 
        Doc.createNode("div", { className: "notification-wrapper" })
    )
    const ViewWrapperRef = Doc.query<HTMLDivElement>(View, ".notification-wrapper")
    return useMixin(View, {
        push(title: string, message: string, options?: NotificationOption) {
            ViewWrapperRef.appendChild(NotificationItem(title, message, options))
            ViewWrapperRef.scrollBy(0, ViewWrapperRef.scrollHeight)
        }
    })
})()

export default Notifications
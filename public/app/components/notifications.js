// @ts-check
import Doc, { useStyles, useMixin, unmount, useEvent } from "../../../modules/doc/module.js"
import Box, { Arrow, Seperator, Title } from "./box.js"

/**
 * @param {string} title 
 * @param {string} message 
 * @param {Object} [options]
 * @param {number} [options.timeout]
 * @param {boolean} [options.removeOnClick]
 */
function NotificationItem(title, message, options = { timeout: 5000 }) {
    let { timeout, removeOnClick } = options

    const View = Box({ className: "notification" },
        Arrow("top-right"),
        Doc.createNode("div", { className: "notification-title" },
            Title({ }, title || ""),
            Seperator()
        ),
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
    return useMixin(Doc.createNode("div", { id: "notifications" }, 
        Doc.createNode("div", { className: "notification-wrapper" } )
    ), {
        /**
         * @param {string} title 
         * @param {string} message 
         * @param {Object} [options]
         * @param {number} [options.timeout]
         * @param {boolean} [options.removeOnClick]
         */
        push(title, message, options) {
            Notifications.querySelector(".notification-wrapper").appendChild(NotificationItem(title, message, options))
        }
    })
})()

document.body.appendChild(Notifications)

export default Notifications
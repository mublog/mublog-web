// @ts-check
import { Div } from "./generic.js"
import Box, { Arrow, Seperator, Title } from "./box.js"
import { isComment } from "./decorators.js"

/**
 * @param {string} title 
 * @param {string} message 
 * @param {Object} [options]
 * @param {number} [options.timeout]
 * @param {boolean} [options.removeOnClick]
 */
function NotificationItem(title, message, options = { timeout: 5000 }) {
    let { timeout, removeOnClick } = options
    let component = Box({ className: "notification" },
        Arrow("top-right"),
        isComment(Title({ className: "notification-title" }, title)).if(!title),
        isComment(Seperator()).if(!title),
        message
    )
    if (timeout) {
        component.style({
            animation: `notification-slide 250ms ease-in-out ${timeout - 250}ms 1 reverse none !important`
        })
        setTimeout(() => component.unmount(), timeout)
    }
    if (removeOnClick) {
        component.addEvent("click", node => node.unmount())
    }
    return component
}

const Notifications = (function() {
    let component = Div({ id: "notifications" },
        Div({ key: "wrapper", className: "notification-wrapper" })
    ).mixin({
        /**
         * @param {string} title 
         * @param {string} message 
         * @param {Object} [options]
         * @param {number} [options.timeout]
         * @param {boolean} [options.removeOnClick]
         */
        push(title, message, options) {
            component.child("wrapper").append(NotificationItem(title, message, options))
        }
    })
    return component
})()

Notifications.appendTo(document.body)

export default Notifications
// @ts-check
import { Div } from "./generic.js"
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
    let component = Box({ className: "notification" },
        Arrow("top-right"),
        Title({ className: "notification-title" }, title),
        Seperator(),
        Box({ className: "notification-message"}, message)
    )
    if (timeout) {
        setTimeout(() => component.unmount(), timeout)
    }
    if (removeOnClick) {
        component.addEvent("click", node => node.unmount())
    }
    return component
}

const Notifications = (function() {
    let component = Div({ id: "notifications" }).mixin({
        /**
         * @param {string} title 
         * @param {string} message 
         * @param {Object} [options]
         * @param {number} [options.timeout]
         * @param {boolean} [options.removeOnClick]
         */
        push(title, message, options) {
            component.append(NotificationItem(title, message, options))
        }
    })
    return component
})()

export default Notifications
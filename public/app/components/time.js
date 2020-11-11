// @ts-check
import Choc from "../../../modules/choc/module.js"
import i18n from "../../lang/de_DE.js"

export default function Time({ dateTime, ...props }) {
    let [ interval, innerText ] = elapsedTime(dateTime)
    let time = Choc.create("time", { ...props, innerText })
    let intervalNum = setInterval(update, interval)
    function update() {
        let [ _interval, _innerText ] = elapsedTime(dateTime)
        if (_interval !== interval) {
            interval = _interval
        }
        if (onScreen(time)) {
            time.update({ innerText: _innerText })
        }
        if (!time.nativeElement.isConnected) {
            clearInterval(intervalNum)
            time.unmount()
            time = undefined
        }
    }
    return time
}

/**
 * @param {number} dateTime
 * @returns {[any, string]}
 */
export function elapsedTime(dateTime) {
    let sec = Math.floor((Date.now() - dateTime) / 1000), n, int
    n = Math.floor(sec / 31536000), int = 604800000
    if (n == 1) {
        return [int, i18n.yearAgo]
    }
    else if (n > 1) {
        return [int, replace(i18n.yearsAgo, n)]
    }
    n = Math.floor(sec / 2592000)
    if (n == 1) {
        return [int, i18n.monthAgo]
    }
    else if (n > 1) {
        return [int, replace(i18n.monthsAgo, n)]
    }
    n = Math.floor(sec / 604800)
    if (n == 1) {
        return [int, i18n.weekAgo]
    }
    else if (n > 1) {
        return [int, replace(i18n.monthsAgo, n)]
    }
    n = Math.floor(sec / 86400), int = 360000
    if (n == 1) {
        return [int, i18n.dayAgo]
    }
    else if (n > 1) {
        return [int, replace(i18n.daysAgo, n)]
    }
    n = Math.floor(sec / 3600), int = 60000
    if (n == 1) {
        return [int, i18n.hourAgo]
    }
    else if (n > 1) {
        return [int, replace(i18n.hoursAgo, n)]
    }
    n = Math.floor(sec / 60), int = 10000
    if (n == 1) {
        return [int, i18n.minuteAgo]
    }
    else if (n > 1) {
        return [int, replace(i18n.minutesAgo, n)]
    }
    n = Math.floor(sec), int = 1000
    if (n == 1) {
        return [int, i18n.secondAgo]
    }
    else {
        return [int, replace(i18n.secondsAgo, n)]
    }
}

/**
 * @param {string} text
 * @param {number} time
 */
function replace(text, time) {
    return text.replace("$n", time + "")
}

/**
 * @param {Choc} node
 */
function onScreen(node) {
    if (!(node.nativeElement instanceof Element)) {
        return false
    }
    const { top, bottom } = node.nativeElement.getBoundingClientRect()
    if ((top && bottom) === 0) {
        return false
    }
    return top < innerHeight && bottom >= 0
}
import Doc, { useState, unmount } from "../../../modules/doc/module"
import i18n from "../../lang/de_DE.json"

export default function Time({ datetime, ...props }: Partial<HTMLTimeElement> & { datetime: number }) {
    let init = elapsedTime(datetime)
    const Interval = useState(init[0])
    const InnerText = useState(init[1])
    const View = Doc.createNode("time", { ...props, innerText: InnerText })
    let interval = setInterval(update, Interval.value)
    function update() {
        let [ newInterval, newInnerText ] = elapsedTime(datetime)
        Interval.value = newInterval
        if (onScreen(View)) {
            if (InnerText.value !== newInnerText) {
                InnerText.value = newInnerText
            }
        }
        if (!View.isConnected) {
            clearInterval(interval)
            unmount(View)
        }
    }
    return View
}

export function elapsedTime(dateTime: number): [number, string] {
    let sec = Math.floor((Date.now() - dateTime) / 1000)
    let n: number
    let int: number
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

function replace(text: string, time: number) {
    return text.replace("$n", time + "")
}

function onScreen(node: Element) {
    const { top, bottom } = node.getBoundingClientRect()
    if ((top && bottom) === 0) {
        return false
    }
    return top < innerHeight && bottom >= 0
}
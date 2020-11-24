import { createElement, useState, onInterval } from "../../modules/doc/mod"
import i18n from "../../lang/de_DE.json"

export default function Time({ datetime, ...props }: HTMLProperties<HTMLTimeElement> & { datetime: number }) {
  const InnerText = useState(elapsedTime(datetime))
  const View = <time {...props} dateTime={datetime} innerText={InnerText} /> as HTMLTimeElement
  onInterval(() => {
    InnerText.set(elapsedTime(datetime))
  }, 1000)
  return View
}

export function elapsedTime(datetime: number): string {
  let sec = Math.floor((Date.now() - datetime) / 1000)
  let n: number
  n = Math.floor(sec / 31536000)
  if (n == 1) {
    return i18n.yearAgo
  }
  else if (n > 1) {
    return replace(i18n.yearsAgo, n)
  }
  n = Math.floor(sec / 2592000)
  if (n == 1) {
    return i18n.monthAgo
  }
  else if (n > 1) {
    return replace(i18n.monthsAgo, n)
  }
  n = Math.floor(sec / 604800)
  if (n == 1) {
    return i18n.weekAgo
  }
  else if (n > 1) {
    return replace(i18n.monthsAgo, n)
  }
  n = Math.floor(sec / 86400)
  if (n == 1) {
    return i18n.dayAgo
  }
  else if (n > 1) {
    return replace(i18n.daysAgo, n)
  }
  n = Math.floor(sec / 3600)
  if (n == 1) {
    return i18n.hourAgo
  }
  else if (n > 1) {
    return replace(i18n.hoursAgo, n)
  }
  n = Math.floor(sec / 60)
  if (n == 1) {
    return i18n.minuteAgo
  }
  else if (n > 1) {
    return replace(i18n.minutesAgo, n)
  }
  n = Math.floor(sec)
  if (n == 1) {
    return i18n.secondAgo
  }
  else {
    return replace(i18n.secondsAgo, n)
  }
}

function replace(text: string, time: number) {
  return text.replace("$n", time + "")
}
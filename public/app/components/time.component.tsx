import { createElement, useState, onInterval } from "../../modules/doc/mod"
import elapsedTime from "../helpers/elapsed-time"

export default function Time({ datetime, ...props }: HTMLProperties<HTMLTimeElement> & { datetime: number }) {
  const InnerText = useState(elapsedTime(datetime))
  const View = <time {...props} dateTime={datetime} innerText={InnerText} /> as HTMLTimeElement
  onInterval(() => {
    InnerText.set(elapsedTime(datetime))
  }, 1000)
  return View
}
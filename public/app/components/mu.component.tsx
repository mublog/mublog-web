import { createElement, useRef, useState } from "../../modules/doc/mod"
import translateMarkDown from "../helpers/mark-down"

export function Label(
  props: HTMLProperties<HTMLDivElement> & { labelText: string },
  ...children: Child[]
) {
  let className = "label"
  if (props.className) {
    className += " " + props.className
    delete props.className
  }
  let labelText = props.labelText
  delete props.labelText
  return (
    <div {...props} className={className}>
      <label className="label-content">{labelText}</label>
      {...children}
    </div>
  ) as HTMLDivElement
}

export function Button(props: HTMLProperties<HTMLButtonElement>, ...children: Child[]) {
  if (!props) props = {}
  let className = "button"
  if (props.className) {
    className += " " + props.className
    delete props.className
  }
  return (
    <button {...props} className={className}>
      <div className="button-content">
        {...children}
      </div>
    </button>
  ) as HTMLButtonElement
}

export function Header(props: HTMLProperties<HTMLDivElement>, ...children: Child[]) {
  if (!props) props = {}
  let className = "header"
  if (props.className) {
    className += " " + props.className
    delete props.className
  }
  return (
    <header {...props} className={className}>
      <div className="title header-content">
        {...children}
      </div>
      <Seperator />
    </header>
  ) as HTMLDivElement
}

export function Footer(props: HTMLProperties<HTMLDivElement>, ...children: Child[]) {
  if (!props) props = {}
  let className = "footer-content"
  if (props.className) {
    className += " " + props.className
    delete props.className
  }
  return (
    <footer {...props} className="footer">
      <Seperator />
      <div className={className}>
        {...children}
      </div>
    </footer>
  ) as HTMLDivElement
}

export function Input(props: HTMLProperties<HTMLInputElement>) {
  return (
    <div className="input">
      <input {...props} />
    </div>
  ) as HTMLDivElement
}

export function TextArea(props: HTMLProperties<HTMLTextAreaElement>) {
  return (
    <div className="input">
      <textarea {...props} />
    </div>
  ) as HTMLDivElement
}

export function Seperator(): HTMLSpanElement {
  return <span className="seperator"></span>
}

export type IconName =
  "menu-kebab" | "menu-meatballs" | "menu-bento" |
  "heart-grey" | "heart-pink" | "heart-red" |
  "comment-bubbles-grey" | "comment-bubbles" |
  "magnifier" | "clock" | "calendar"

export interface IconElement extends HTMLElement {
  setIcon(name: IconName): void
}

export function Icon({ name, ...props }: HTMLProperties<HTMLElement> & { name: IconName }) {
  let className = "icon icon-"
  let iconName: string = "icon-" + name
  if (name) {
    className += name
  }
  if (props.className) {
    className += " " + props.className
    delete props.className
  }
  const View = <i {...props} className={className} setIcon={setIcon} /> as IconElement
  return View

  function setIcon(name: IconName) {
    View.classList.replace(iconName, "icon-" + name)
    iconName = "icon-" + name
  }
}

export interface WriterElement extends HTMLDivElement {
  getValues(): {
    raw: string
    rich: string
  },
  textArea: Reference<HTMLTextAreaElement>
}

export interface WriterElementConstructor {
  placeholder?: string
  value?: string
  ref?: Reference<WriterElement>
}

export function Writer({ placeholder, value, ref }: WriterElementConstructor, ...children: Child[]): WriterElement {
  const TextAreaRef = useRef<HTMLTextAreaElement>()
  const MarkDownContent = useRef<HTMLDivElement>()
  const Visible = useState(false)

  return (
    <div className="box writer" getValues={getValues} ref={ref} textArea={TextAreaRef}>
      <div>
        <TextArea ref={TextAreaRef} oninput={writeMarkDown} placeholder={placeholder || ""} value={value || ""} />
        <Icon name="magnifier" className="toggle-post-preview" onclick={toggleVisibility} />
      </div>
      <Footer>
        <div className="mark-down-wrapper" if={Visible}>
          <div className="box" ref={MarkDownContent} />
          <Seperator />
        </div>
        {...children}
      </Footer>
    </div>
  )

  function getValues() {
    const el = MarkDownContent.get()
    const text = TextAreaRef.get().value
    if (el && text) {
      return {
        raw: text,
        rich: el.innerHTML
      }
    }
  }

  function writeMarkDown() {
    const el = MarkDownContent.get()
    const text = TextAreaRef.get().value
    if (el && text) {
      el.innerHTML = translateMarkDown(text)
    }
  }

  function toggleVisibility() {
    Visible.set(Visible.get() ? false : true)
  }
}
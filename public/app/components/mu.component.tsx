import Doc, { reference, observable } from "../../mod/doc/mod"
import translateMarkDown from "../helpers/mark-down"
import elapsedTime from "../helpers/elapsed-time"
import onScreen from "../helpers/onscreen"
import { Uploads } from "../services/generic.service"
import i18n from "../../lang/de_DE.json"

export function Box(props: HTMLProperties<HTMLDivElement> & { arrow?: ArrowPositions }, ...children: Child[]) {
  if (!props) {
    props = {}
  }
  let className = "box"
  if (props.className) {
    className += " " + props.className
    delete props.className
  }
  return (
    <div className={className} {...props}>
      <div className={"arrow arrow-" + props.arrow} if={!!props.arrow} />
      <div className="box-content">{...children}</div>
    </div>
  ) as HTMLDivElement
}

declare type ArrowPositions = "top-left" | "top-right" | "bottom-left" | "bottom-right"

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
    <footer className="footer" {...props}>
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
  "heart-grey" | "heart-red" |
  "comment-bubbles-grey" | "comment-bubbles" |
  "magnifier" | "clock" | "calendar" | "x-red" |
  "clipboard"

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
  const View = <i className={className} setIcon={setIcon} {...props} /> as IconElement
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
  clear(): void
}

export interface WriterElementConstructor {
  placeholder?: string
  value?: string | Observable<string>
  ref?: Reference<WriterElement>
}

export function Writer({ placeholder, value, ref }: WriterElementConstructor, ...children: Child[]): WriterElement {
  const TextAreaRef = reference<HTMLTextAreaElement>()
  const MarkDownContent = reference<HTMLDivElement>()
  const Visible = observable(false)

  return (
    <div className="box writer" getValues={getValues} ref={ref} clear={clear}>
      <div>
        <TextArea ref={TextAreaRef} oninput={writeMarkDown} placeholder={placeholder || ""} value={value || ""} />
        <span tooltip={i18n.showPostPreview}>
          <Icon name="magnifier" className="toggle-post-preview" onclick={toggleVisibility} styles={{ cursor: "pointer" }} />
        </span>
      </div>
      <Footer>
        <div className="mark-down-wrapper" if={Visible}>
          <div className="box mark-down" ref={MarkDownContent} />
          <Seperator />
        </div>
        {...children}
      </Footer>
    </div>
  )

  function clear() {
    TextAreaRef.current.value = ""
    MarkDownContent.current.innerHTML = ""
    Visible.set(false)
  }

  function getValues() {
    const el = MarkDownContent.current
    const text = TextAreaRef.current
    if (el && text) {
      return {
        raw: text.value,
        rich: el.innerHTML
      }
    }
  }

  function writeMarkDown() {
    const el = MarkDownContent.current
    const text = TextAreaRef.current
    if (el && text) {
      el.innerHTML = translateMarkDown(text.value)
    }
  }

  function toggleVisibility() {
    Visible.set(!Visible.value())
  }
}

export function Time({ datetime, ...props }: HTMLProperties<HTMLTimeElement> & { datetime: number }) {
  const InnerText = observable(elapsedTime(datetime))
  const View = <time dateTime={datetime} innerText={InnerText} interval={[intervalFn, 5000]}  {...props} /> as HTMLTimeElement
  function intervalFn() {
    if (onScreen(View)) InnerText.set(elapsedTime(datetime))
  }
  return View
}

export function UploadItemElement(props: HTMLProperties<HTMLDivElement> & Omit<UploadItem<string>, "key">) {
  return (
    <div className="upload-item" {...props}>
      <img src={props.fileData} className="upload-image" />
      <div className="upload-text">{props.fileName}</div>
      <span copyToClipboard={props.fileData} styles={{ display: "flex", alignItems: "center" }}>
        <Icon name="clipboard" className="upload-action" />
      </span>
      <Icon name="x-red" onclick={removeUpload} className="upload-action" />
    </div>
  ) as HTMLDivElement

  function removeUpload() {
    Uploads.update(files => {
      let idx = files.findIndex(file => file.key === props.key)
      if (idx >= 0) files.splice(idx, 1)
    })
  }
}
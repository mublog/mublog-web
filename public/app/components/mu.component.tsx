import Doc, { reference, observable, directive } from "../../mod/doc/mod"
import translateMarkDown from "../helpers/mark-down"
import elapsedTime from "../helpers/elapsed-time"
import onScreen from "../helpers/onscreen"
import { Uploads } from "../services/generic.service"
import * as PostService from "../services/post.service"
import i18n from "../../lang/de_DE.json"

directive("isBox", el => el.classList.add("box"))
export function Box(props: HTMLProperties<HTMLDivElement> & { arrow?: ArrowPositions }, ...children: Child[]) {
  if (!props) props = {}
  return (
    <div {...props} isBox>
      {!props.arrow ? undefined : <div className={"arrow arrow-" + props.arrow} />}
      <div className="box-content">{children}</div>
    </div>
  ) as HTMLDivElement
}

declare type ArrowPositions = "top-left" | "top-right" | "bottom-left" | "bottom-right"

directive("isLabel", el => el.classList.add("label"))
export function Label(
  props: HTMLProperties<HTMLDivElement> & { labelText: string },
  ...children: Child[]
) {
  return (
    <div {...props} isLabel>
      <label className="label-content">{props.labelText}</label>
      {children}
    </div>
  ) as HTMLDivElement
}

directive("isButton", el => el.classList.add("button"))
export function Button(props: HTMLProperties<HTMLButtonElement>, ...children: Child[]) {
  if (!props) props = {}
  return (
    <button {...props} isButton>
      <div className="button-content">
        {children}
      </div>
    </button>
  ) as HTMLButtonElement
}

directive("isHeader", el => el.classList.add("header"))
export function Header(props: HTMLProperties<HTMLDivElement>, ...children: Child[]) {
  if (!props) props = {}
  return (
    <header {...props} isHeader>
      <div className="title header-content">
        {children}
      </div>
      <Seperator />
    </header>
  ) as HTMLDivElement
}

directive("isFooter", el => el.classList.add("footer"))
export function Footer(props: HTMLProperties<HTMLDivElement>, ...children: Child[]) {
  if (!props) props = {}
  return (
    <footer {...props} isFooter>
      <Seperator />
      <div className="footer-content">
        {children}
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
  return <span className="seperator" />
}

export type IconName =
  "menu-kebab" | "menu-meatballs" | "menu-bento" |
  "heart-grey" | "heart-red" |
  "comment-bubbles-grey" | "comment-bubbles" |
  "magnifier" | "clock" | "calendar" | "x-red" |
  "clipboard" | "user-follow" | "user-unfollow" | "user-loading"

export interface IconElement extends HTMLElement {
  setIcon(name: IconName): void
}

export function Icon({ name, ...props }: HTMLProperties<HTMLElement> & { name: IconName }) {
  let className = "icon icon-"
  let iconName: string = "icon-" + name
  if (name) className += name
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
        {children}
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

directive("isUploadItem", el => el.classList.add("upload-item"))
export function UploadItemElement(props: HTMLProperties<HTMLDivElement> & Partial<UploadItem>) {
  return (
    <div {...props} isUploadItem>
      <img src={props.preview} className="upload-image" />
      <div className="upload-text">{props.fileName}</div>
      <div>
        <Icon name="clipboard" copyToClipboard={`![${props.fileName}](${props.preview})`} className="upload-action" />
        <Icon tooltip={i18n.removeImage} name="x-red" onclick={removeUpload} className="upload-action" />
      </div>
    </div>
  ) as HTMLDivElement

  function removeUpload() {
    Uploads.update(files => {
      let idx = files.findIndex(file => file.key === props.key)
      if (idx >= 0) {
        files.splice(idx, 1)
        PostService.delMedia(props.key)
      }
    })
  }
}

directive("isMenu", el => el.classList.add("menu"))
export function Menu(props: HTMLProperties<HTMLUListElement>, ...children: Child[]) {
  return (
    <ul {...props} isMenu isBox>
      {children}
    </ul>
  ) as HTMLUListElement
}

directive("isMenuItem", el => el.classList.add("menu-item"))
export function MenuItem(props: HTMLProperties<HTMLLIElement>, ...children: Child[]) {
  return (
    <li {...props} isMenuItem>
      {children}
    </li>
  ) as HTMLLIElement
}
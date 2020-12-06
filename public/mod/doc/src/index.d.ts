declare type HTMLComponent<Type extends HTMLElement> = (...args: any[]) => Type
declare type HTMLProperties<Type extends HTMLElement> =
  & Partial<{ [key in keyof Omit<Type, keyof Element | "accessKey" | "accessKeyLabel">]: any }>
  & Partial<{ [key in keyof Pick<Type, keyof Element | "className" | "id">]: any }>
  & Partial<DocDirectives>
  & { [key: string]: any }
declare interface DocDirectives {
  for: {
    of: Subscribable<any[]> | any[]
    do: HTMLComponent<any>
    sort?: (a: any, b: any) => number
    filter?: (value: any, index: number) => unknown
    limit?: number
    offset?: number
  }
  if: State<boolean> | boolean
  ref: Reference<HTMLElement>
  portal: Portal<any>
  styles: Partial<CSSStyleDeclaration> | State<Partial<CSSStyleDeclaration>>
}
declare namespace JSX {
  type IntrinsicElements = { [key in keyof HTMLElementTagNameMap]: HTMLProperties<HTMLElementTagNameMap[key]> }
}
declare type Update<Type> = (value: Type) => any
declare type Subscription<Type> = (value: Type) => any
declare interface State<Type> {
  isState: boolean
  value(): Type
  set(value: Type): State<Type>
  update(fn: Update<Type>): State<Type>
  subscribe(fn: Subscription<Type>): () => void
}
declare type EventMap = GlobalEventHandlersEventMap & WindowEventMap
declare type EventNames = keyof EventMap
declare type AttributeChangedCallback = (name: string, oldValue: string) => any
declare type HTMLTag = keyof HTMLElementTagNameMap
declare type HTMLOptions<Tag extends HTMLTag> = Partial<HTMLElementTagNameMap[Tag]> & { [key: string]: any }
declare type HTMLElementChild = HTMLElement | State<HTMLElement>
declare type HTMLPrimitiveChild = string | number | State<string | number>
declare type Child = HTMLElementChild | HTMLPrimitiveChild
declare type AnyFn = () => any
declare type IntervalFn = () => any
declare interface Reference<Type> {
  isRef: boolean
  current: Type
}
declare interface Portal<Type extends (...args: any[]) => Promise<HTMLElement> | HTMLElement> {
  isPortal: boolean
  set(newAnchor: HTMLElement): Portal<Type>
  open(props: Parameters<Type>[0], ...children: Child[]): Promise<void>
  onOpen(fn: () => any): Portal<Type>
  onClose(fn: () => any): Portal<Type>
  close(): Portal<Type>
}
declare type RouteActivator = (params?: URLParams) => boolean | Promise<boolean>
declare type RouterComponent = (params?: URLParams) => HTMLElement | Promise<HTMLElement>
declare type URLParams = { [parameter: string]: string }
declare type URLQuery = {
  [parameter: string]: string | string[]
}
declare type RouteTitle = string | ((params: URLParams) => string)
declare interface LoadedRoute {
  params: URLParams
  component: HTMLElement
  title?: string
}
declare interface Route {
  matcher: RegExp
  params?: URLParams
  component: RouterComponent
  activates?: RouteActivator[]
  title?: RouteTitle
}
declare interface RouteConstructor {
  path: string
  component: RouterComponent
  title?: RouteTitle
  activates?: RouteActivator[]
  children?: RouteConstructor[]
}
declare interface Subscribable<Type> {
  subscribe(fn: (value: Type) => any): () => void
  value?(): Type
  set?(newValue: Type): void
  update?(fn: (value: Type) => Type): void
}
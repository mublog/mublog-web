declare type HTMLComponent<Type extends HTMLElement> = (...args: any[]) => Type
declare type HTMLProperties<Type extends HTMLElement> =
  & Partial<{ [key in keyof Omit<Type, keyof Element | "accessKey" | "accessKeyLabel">]: any }>
  & Partial<{ [key in keyof Pick<Type, keyof Element | "className" | "id">]: any }>
  & Partial<DocDirectives>
  & { [key: string]: any }
declare interface DocDirectives {
  for: {
    of: State<any[]> | Store<any> | any[]
    do: HTMLComponent<any>
  }
  if: State<boolean> | boolean
  ref: Reference<HTMLElement>
  styles: Partial<CSSStyleDeclaration> | State<Partial<CSSStyleDeclaration>>
}
declare namespace JSX {
  type IntrinsicElements = { [key in keyof HTMLElementTagNameMap]: HTMLProperties<HTMLElementTagNameMap[key]> }
}
declare type Update<Type> = (value: Type) => Type
declare type Subscription<Type> = (value: Type) => any
declare interface State<Type> {
  isState(): boolean
  get(): Type
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
declare type StorePredicate<Type> = (value: Type, index: number) => unknown
declare interface StoreItem {
  [key: string]: any
}
declare type StoreUpdate<Type> = (value: Type) => Type
declare interface Store<Type extends StoreItem> {
  isStore(): boolean
  get(): Type[]
  size(): number
  updateOne(fn: StorePredicate<Type>, up: StoreUpdate<Type>): boolean
  each(fn: StorePredicate<Type>): Store<Type>
  add(item: Type): Store<Type>
  clear(): Store<Type>
  del(fn: StorePredicate<Type>): Store<Type>
  find(fn: StorePredicate<Type>): Type
  filter(fn: StorePredicate<Type>): Type[]
  subscribe(fn: (items: Type[]) => any): () => void
}
declare interface Reference<Type> {
  isRef(): boolean
  get(): Type
  set(newValue: Type): Reference<Type>
  subscribe(fn: Subscription<Type>): () => void
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
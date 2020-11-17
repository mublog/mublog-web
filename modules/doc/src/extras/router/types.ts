export type RouteActivator = (...args: any[]) => boolean | Promise<boolean>
export type RouterComponent = ((...args: any[]) => Element | Promise<Element>)
export type URLParams = { [parameter: string]: string }
export type RouteTitle = string | ((params: URLParams) => string)
export interface LoadedRoute {
    params: URLParams
    component: Element
    title?: string
}
export interface Route {
    matcher: RegExp
    params?: URLParams
    component: RouterComponent
    activates?: RouteActivator[]
    title?: RouteTitle
}
export interface RouteConstructor {
    path: string
    component: RouterComponent
    title?: RouteTitle
    activates?: RouteActivator[]
    children?: RouteConstructor[]
}
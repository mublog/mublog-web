// @ts-check

/**
 * @typedef {import("../../choc").default} Component
 */

/**
 * @typedef {(...args: any[]) => (boolean | Promise<boolean>)} RouteActivator
 */

/**
 * @typedef {((...args: any[]) => (Component | Promise<Component>))} RouterComponent
 */

/**
 * @typedef {{ [parameter: string]: string }} URLParams
 */

/**
 * @typedef {string | ((params: URLParams) => string)} RouteTitle
 */

/**
 * @typedef LoadedRoute
 * @property {URLParams} params
 * @property {Component} component
 * @property {string} [title]
 */

/**
 * @typedef Route
 * @property {RegExp} matcher
 * @property {URLParams} [params]
 * @property {RouterComponent} component
 * @property {RouteActivator[]} [activates]
 * @property {RouteTitle} [title]
 */

/**
 * @typedef RouteConstructor
 * @property {string} path
 * @property {RouterComponent} component
 * @property {RouteTitle} [title]
 * @property {RouteActivator[]} [activates]
 * @property {RouteConstructor[]} [children]
 */

export default true
// @ts-check
import hash from "./hash.js"

const styleElement = document.createElement("style")
document.head.appendChild(styleElement)
const CSSSheet = styleElement.sheet
const CSSMap = new Map()
const Styles = Symbol("styles")

/**
 * @template target
 * @param {target & Element} el 
 * @param {Partial<CSSStyleDeclaration>} cssStyleDeclaration
 * @returns {target}
 */
export function useStyles(el, cssStyleDeclaration) {
    if (!el[Styles]) {
        el[Styles] = Object.create(null)
    }
    for (let rule in cssStyleDeclaration) {
        let property = rule.replace(/([A-Z])/g, "-$1").toLowerCase()
        let value = `${property}: ${cssStyleDeclaration[rule]};`
        let name = "r-" + hash(value)
        let style = `.${name} { ${value} }`
        let active = el[Styles][property]
        if (!CSSMap.has(name)) {
            CSSMap.set(name, style)
            CSSSheet.insertRule(style, CSSSheet.rules.length)
        }
        if (!active) {
            el[Styles][property] = name
            el.classList.add(name)
        }
        else {
            if (active !== name) {
                el[Styles][property] = name
                el.classList.replace(active, name)
            }
        }
    }
    return el
}

/**
 * @template target
 * @param {target & Element} el 
 * @param {Partial<CSSStyleDeclaration>} cssStyleDeclaration
 * @returns {target}
 */
export function useStyleGroup(el, cssStyleDeclaration) {
    if (!el[Styles]) {
        el[Styles] = Object.create(null)
    }
    let name = "g-"
    let style = ""
    let rule = ""
    for (let rule in cssStyleDeclaration) {
        let property = rule.replace(/([A-Z])/g, "-$1").toLowerCase()
        style += `${property}: ${cssStyleDeclaration[rule]};`
    }
    name += hash(style)
    rule = `.${name} { ${style} }`
    if (!CSSMap.has(name)) {
        CSSMap.set(name, rule)
        CSSSheet.insertRule(rule, CSSSheet.rules.length)
    }
    el.classList.add(name)
    return el
}
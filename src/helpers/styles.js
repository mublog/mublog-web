// @ts-check
import hash from "./hash.js"

const styleElement = document.createElement("style")
document.head.appendChild(styleElement)
const CSSSheet = styleElement.sheet
const CSSMap = new Map()

export default class Styles {
    /** @type {Map<string, string>} */
    $map = new Map()
    /** @type {import("../choc").default} */
    $node

    /** @param {import("../choc").default} node */
    constructor(node) {
        this.$node = node
    }

    /**
     * @param {string} name 
     */
    has(name) {
        return this.$map.has(name)
    }

    /**
     * @param {string} name 
     */
    get(name) {
        return this.$map.get(name)
    }

    /**
     * @param {Partial<CSSStyleDeclaration>} styleDeclaration 
     */
    add(styleDeclaration) {
        for (let rule in styleDeclaration) {
            let property = rule.replace(/([A-Z])/g, "-$1").toLowerCase()
            let value = `${property}: ${styleDeclaration[rule]};`
            let name = "r-" + hash(value)
            let style = `.${name} { ${value} }`
            let active = this.get(property)
            if (!CSSMap.has(name)) {
                CSSMap.set(name, style)
                CSSSheet.insertRule(style, CSSSheet.rules.length)
            }
            if (!active) {
                this.$map.set(property, name)
                this.$node.nativeElement.classList.add(name)
            }
            else {
                if (active !== name) {
                    this.$map.set(property, name)
                    this.$node.nativeElement.classList.replace(active, name)
                }
            }
        }
    }

    /**
     * @param {Partial<CSSStyleDeclaration>} styleDeclaration 
     */
    addGroup(styleDeclaration) {
        let name = "g-"
        let style = ""
        let rule = ""
        for (let rule in styleDeclaration) {
            let property = rule.replace(/([A-Z])/g, "-$1").toLowerCase()
            style += `${property}: ${styleDeclaration[rule]};`
        }
        name += hash(style)
        rule = `.${name} { ${style} }`
        if (!CSSMap.has(name)) {
            CSSMap.set(name, rule)
            CSSSheet.insertRule(rule, CSSSheet.rules.length)
        }
        this.$node.nativeElement.classList.add(name)
        return name
    }
}
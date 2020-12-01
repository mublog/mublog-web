import { blank, createHash } from "./helper"
import { Styles } from "./globals"

const styleElement = document.createElement("style")
document.head.appendChild(styleElement)
const CSSSheet: CSSStyleSheet = styleElement.sheet
const CSSMap = blank()

export function useStyles(el: HTMLElement, rules: Partial<CSSStyleDeclaration>) {
  if (!el[Styles]) {
    el[Styles] = blank()
  }
  let add: string[] = []
  let del: string[] = []
  for (let rule in rules) {
    let property = createProperty(rule)
    let name = insertRule(`${property}: ${rules[rule]};`)
    if (!el[Styles][property]) {
      el[Styles][property] = name
      add.push(name)
    }
    else {
      del.push(el[Styles][property])
      el[Styles][property] = name
      add.push(name)
    }
  }
  el.classList.remove(...del)
  el.classList.add(...add)
}

function createProperty(ruleName: string) {
  return ruleName.replace(/([A-Z])/g, "-$1").toLowerCase()
}

function insertRule(rule: string) {
  let name = "r-" + createHash(rule)
  let style = `.${name} { ${rule} }`
  if (!CSSMap[name]) {
    CSSMap[name] = style
    CSSSheet.insertRule(style, CSSSheet.rules.length)
  }
  else {
    if (CSSMap[name] !== style) {
      name += "_"
      CSSSheet.insertRule(style, CSSSheet.rules.length)
    }
  }
  return name
}
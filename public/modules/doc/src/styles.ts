import { blank, createHash, keysOf } from "./helper"
import { Styles } from "./globals"

const styleElement = document.createElement("style")
document.head.appendChild(styleElement)
const CSSSheet: CSSStyleSheet = styleElement.sheet
const CSSMap = blank()

export function useStyles(el: HTMLElement, rules: Partial<CSSStyleDeclaration>) {
  if (!el[Styles]) el[Styles] = blank()
  const elStyles = el[Styles]
  const add: string[] = []
  const del: string[] = []
  const keys = keysOf(rules)
  for (let i = 0, len = keys.length; i < len; i++) {
    const property = keys[i].replace(/([A-Z])/g, "-$1")
    const name = createRule(`${property}: ${rules[keys[i]]};`)
    if (!elStyles[property]) {
      elStyles[property] = name
      add.push(name)
    }
    else {
      del.push(elStyles[property])
      elStyles[property] = name
      add.push(name)
    }
  }
  el.classList.remove(...del)
  el.classList.add(...add)
}

function createRule(rule: string) {
  let name = "r-" + createHash(rule)
  let style = `.${name} { ${rule} }`
  if (!CSSMap[name]) {
    CSSMap[name] = style
    insertRule(style)
  }
  else {
    if (CSSMap[name] !== style) {
      name += "_"
      CSSMap[name] = `.${name} { ${rule} }`
      insertRule(CSSMap[name])
    }
  }
  return name
}

function insertRule(rule: string) {
  CSSSheet.insertRule(rule, CSSSheet.rules.length)
}
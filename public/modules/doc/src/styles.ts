import { blank, createHash, keysOf } from "./helper"
import { Styles } from "./globals"

const styleElement = document.createElement("style")
document.head.appendChild(styleElement)
const CSSSheet: CSSStyleSheet = styleElement.sheet
const CSSMap = blank()

export function useStyles(el: HTMLElement, rules: Partial<CSSStyleDeclaration>) {
  if (!el[Styles]) {
    el[Styles] = blank()
  }
  let [add, del, keys, name, property] = declareVariables(rules)
  for (let i = 0, len = keys.length; i < len; i++) {
    property = keys[i].replace(/([A-Z])/g, "-$1")
    name = insertRule(`${property}: ${rules[keys[i]]};`)
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

function declareVariables(rules: Partial<CSSStyleDeclaration>): [
  add: string[],
  del: string[],
  keys: string[],
  rule: string,
  property: string
] {
  return [[], [], keysOf(rules), "", ""]
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
      CSSMap[name] = `.${name} { ${rule} }`
      CSSSheet.insertRule(CSSMap[name], CSSSheet.rules.length)
    }
  }
  return name
}
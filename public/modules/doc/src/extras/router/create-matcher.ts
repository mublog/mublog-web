const R_OPTIONAL = /\*/g
const R_REPLACER = /\:([a-zA-Z]+)/gi
const R_PARAM = "(?<$1>[^\\/\\:\\?]+?)"
const R_START = "^/"
const R_END = "/?$"
const R_WILDCARD_STR = "(\\S+)?"
const R_WILDCARD = /\S+/i
const R_DOUBLESLASH = /\/\//g
const R_SINGLESLASH = "/"
const R_MULTI_WILDCARD = /(\*\*)+/g
const R_SINGLE_WILDCARD = "**"

export default function createMatcher(path: string): RegExp {
    if (path.startsWith("/")) {
        throw new Error("RoutePath cannot start with an '/'")
    }
    if (path.endsWith("/")) {
        throw new Error("RoutePath cannot end with an '/'")
    }
    if (path === "**") {
        return R_WILDCARD
    }
    path = path.replace(R_OPTIONAL, R_WILDCARD_STR)
    path = path.replace(R_REPLACER, R_PARAM)
    path = path.replace(R_DOUBLESLASH, R_SINGLESLASH)
    path = path.replace(R_MULTI_WILDCARD, R_SINGLE_WILDCARD)
    return new RegExp(R_START + path + R_END)
}
export default function parameters(matcher: RegExp, url: string) {
    let matched: RegExpExecArray = matcher.exec(url)
    if (matched.groups) {
        return { ...matched.groups }
    }
    return {}
}
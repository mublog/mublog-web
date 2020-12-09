export default function parameters(matcher: RegExp, url: string) {
  let matched: RegExpExecArray = matcher.exec(url)
  return matched.groups ? { ...matched.groups } : Object.create(null)
}
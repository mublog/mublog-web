// @ts-check

/**
 * @param {RegExp} matcher 
 * @param {string} url 
 */
export default function(matcher, url) {
    /** @type {any} */
    let matched = matcher.exec(url)
    if (matched.groups) {
        return { ...matched.groups }
    }
    return {}
}
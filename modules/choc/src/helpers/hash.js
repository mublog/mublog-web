// @ts-check
/**
 * @param {string} input 
 */
export default function hash(input) {
    let h, i = 0, length = input.length
    for (i; i < length; i++) {
        h = Math.imul(31, h) + input.charCodeAt(i) | 0
    }
    return h.toString(36)
}
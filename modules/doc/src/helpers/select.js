// @ts-check
/**
 * @template view, tag
 * @param {view} view
 * @param {tag & keyof HTMLElementTagNameMap} tag
 * @param {string} options
 * @returns {HTMLElementTagNameMap[tag & keyof HTMLElementTagNameMap]}
 */
export function query(view, tag, options = "") {
    // @ts-expect-error
    return view.querySelector(tag + options)
}

/**
 * @template view, tag
 * @param {view} view
 * @param {tag & keyof HTMLElementTagNameMap} tag
 * @param {string} options
 * @returns {HTMLElementTagNameMap[tag & keyof HTMLElementTagNameMap][]}
 */
export function queryAll(view, tag, options = "") {
    // @ts-expect-error
    return Array.from(view.querySelectorAll(tag + options))
}
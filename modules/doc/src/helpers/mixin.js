// @ts-check

/**
 * @template target, source
 * @param {target} target 
 * @param {source} source
 * @returns {target & source}
 */
export default function useMixin(target, source) {
    const props = Object.keys(source)
    for (const prop of props) {
        const descriptor = Object.getOwnPropertyDescriptor(source, prop)
        Object.defineProperty(target, prop, descriptor)
    }
    // @ts-expect-error
    return target
}
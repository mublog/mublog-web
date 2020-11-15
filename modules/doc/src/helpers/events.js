// @ts-check

/**
 * @template name
 * @typedef {GlobalEventHandlersEventMap[name & keyof GlobalEventHandlersEventMap]} EventObject 
 */

const Events = Symbol("events")

/**
 * @template target
 * @param {target & (Element | window)} el 
 * @param {Partial<{ [key in keyof GlobalEventHandlersEventMap]: (event: EventObject<key>) => void }>} events
 * @returns {target}
 */
export function useEvents(el, events) {
    if (!el[Events]) {
        el[Events] = Object.create(null)
    }
    for (const name in events) {
        if (!el[Events][name]) {
            el[Events][name] = []
            const f = ev => el[Events][name].forEach(listener => listener(ev))
            el.addEventListener(name, x => f(x), false)
        }
        el[Events][name].push(events[name])
    }
    return el
}

/**
 * @template target, name
 * @param {target & (Element | window)} el 
 * @param {name & keyof GlobalEventHandlersEventMap} name
 * @param {(event: EventObject<name>) => void} listener
 * @returns {target}
 */
export function useEvent(el, name, listener) {
    if (!el[Events]) {
        el[Events] = Object.create(null)
    }
    if (!el[Events][name]) {
        el[Events][name] = []
        const f = ev => el[Events][name].forEach(listener => listener(ev))
        el.addEventListener(name, x => f(x), false)
    }
    el[Events][name].push(listener)
    return el
}
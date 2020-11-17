import { EventListener } from "../types"

const Events = Symbol("events")

export function useEvents<Target extends Element | typeof window>(
    el: Target, 
    events: Partial<GlobalEventHandlersEventMap>
): Target {
    if (!el[Events]) {
        el[Events] = Object.create(null)
    }
    for (const name in events) {
        if (!el[Events][name]) {
            el[Events][name] = []
            const f = (ev: Event) => el[Events][name].forEach((listener: (event: Event) => any) => listener(ev))
            el.addEventListener(name, x => f(x), false)
        }
        el[Events][name].push(events[name])
    }
    return el
}

export function useEvent<Name extends keyof GlobalEventHandlersEventMap, Target extends Element | typeof window>(
    el: Target, 
    name: Name, 
    listener: EventListener<Name>
) {
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
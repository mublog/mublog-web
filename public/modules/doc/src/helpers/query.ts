/**
 * Selects the first Element of <Type> from view
 */
export function query<Type>(view: Element, selector: string): Type {
    return view.querySelector(selector) as unknown as Type
}

/**
 * Selects all Elements of <Type> from view
 */
export function queryAll<Type>(view: Element, selector: string): Type[] {
    return Array.from(view.querySelectorAll(selector)) as unknown as Type[]
}
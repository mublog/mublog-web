export type HTMLProperties<Tag> = { 
    [key in keyof HTMLElementTagNameMap[Tag & keyof HTMLElementTagNameMap]]: any
    & { [key: string]: any}
}

export type MappedElement<Tag> = HTMLElementTagNameMap[Tag & keyof HTMLElementTagNameMap]

export interface KeyframeOptions {
    duration: number
    timingFunction?: string
    delay?: number
    iterationCount?: number | "infinite"
    direction?: "normal" | "alternate" | "reverse" | "alternate-reverse"
    fillMode?: "none" | "forwards" | "backwards" | "both"
}

export type EventObject<Name> = GlobalEventHandlersEventMap[Name & keyof GlobalEventHandlersEventMap]
export type EventListener<Name> = (event: EventObject<Name>) => any | Promise<any>

export type Update<Type> = (value: Type) => any | Promise<any>
export type Subscriber<Type> = (value: Type) => any | Promise<any>

export interface State<Type> {
    readonly isState: boolean
    update(update: Update<Type>): Promise<void>
    value: Type
    notify(value: Type): void
    readonly subscribers: Subscriber<Type>[]
    subscribe(subscriber: Subscriber<Type>): void
    unsubscribe(subscriber: Subscriber<Type>): void
    unsubscribeAll(): void
} 
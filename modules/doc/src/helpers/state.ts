import { Update, State, Subscriber } from "../types"

export default function useState<Type>(initialValue: Type): State<Type> {
    let value: Type = initialValue
    let subscribers: Subscriber<Type>[] = []
    const State = {
        get isState() {
            return true
        },
        async update(update: Update<Type>): Promise<void> {
            await update(State.value)
            State.value = State.value
        },
        get value(): Type {
            return value
        },
        notify(value: Type): void {
            subscribers.forEach(sub => sub(value))
        },
        set value(newValue: Type) {
            value = newValue
            State.notify(value)
        },
        get subscribers(): Subscriber<Type>[] {
            return subscribers
        },
        subscribe(fn: Subscriber<Type>): void {
            subscribers.push(fn)
            State.notify(value)
        },
        unsubscribe(fn: Subscriber<Type>): void {
            let index = subscribers.indexOf(fn)
            if (index >= 0) {
                subscribers.splice(index, 1)
            }
        },
        unsubscribeAll(): void {
            subscribers = []
        }
    }
    State.value = initialValue
    return State
}
// @ts-check

/**
 * @template type
 * @param {type} initialValue 
 */
export default function useState(initialValue) {
    let value = initialValue
    const subscribers = []
    const State = {
        get isState() {
            return true
        },
        /** @param {(value: type) => (any | Promise<any>)} callback */
        async update(callback) {
            await callback(State.value)
            State.value = State.value
        },
        get value() {
            return value
        },
        notify(value) {
            subscribers.forEach(sub => sub(value))
        },
        set value(newValue) {
            value = newValue
            State.notify(value)
        },
        /** @param {(value: type) => any} fn */
        subscribe(fn) {
            subscribers.push(fn)
            State.notify(value)
        },
        /** @param {(value: type) => any} fn */
        unsubscribe(fn) {
            let index = subscribers.indexOf(fn)
            if (index >= 0) {
                subscribers.splice(index, 1)
            }
        }
    }
    State.value = initialValue
    return State
}
// @ts-check

/**
 * @template type
 * @typedef State
 * @property {boolean} isState
 * @property {(update: (newValue: type) => (any | Promise<any>)) => void} update 
 * @property {type} value
 * @property {(newValue: type) => any} notify
 * @property {readonly ((newValue: type) => any)[]} subscribers
 * @property {(subscription: (newValue: type) => any) => void} subscribe
 * @property {(subscription: (newValue: type) => any) => void} unsubscribe
 * @property {() => void} unsubscribeAll
 */

/**
 * @template type
 * @param {type} initialValue
 * @returns {State<type>}
 */
export default function useState(initialValue) {
    let value = initialValue
    let subscribers = []
    const State = {
        get isState() {
            return true
        },
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
        get subscribers() {
            return subscribers
        },
        subscribe(fn) {
            subscribers.push(fn)
            State.notify(value)
        },
        unsubscribe(fn) {
            let index = subscribers.indexOf(fn)
            if (index >= 0) {
                subscribers.splice(index, 1)
            }
        },
        unsubscribeAll() {
            subscribers = []
        }
    }
    State.value = initialValue
    return State
}
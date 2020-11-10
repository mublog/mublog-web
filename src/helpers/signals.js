// @ts-check

export default class Signals {
    /** @type {Map<string, ((node: import("../choc").default, ...args: any[]) => any)[]>} */
    $map = new Map()
    /** @type {import("../choc").default} */
    $node

    /** @param {import("../choc").default} node */
    constructor(node) {
        this.$node = node
    }

    /**
     * @param {string} name 
     */
    has(name) {
        return this.$map.has(name)
    }

    /**
     * @param {string} name 
     */
    get(name) {
        return this.$map.get(name)
    }

    /**
     * @param {string} name 
     * @param {(...args: any[]) => any} fn 
     */
    add(name, fn) {
        if (!this.has(name)) {
            this.$map.set(name, [])
        }
        this.get(name).push(fn)
        return this
    }

    /**
     * @param {string} name 
     * @param {(...args: any[]) => any} fn 
     */
    del(name, fn) {
        if (!this.has(name)) {
            let signals = this.get(name)
            let idx = signals.indexOf(fn)
            if (idx >= 0) {
                signals.splice(idx, 1)
            }
        }
        return this
    }

    /**
     * @param {string} name 
     * @param {any[]} args
     */
    run(name, args) {
        if (this.$map.has(name)) {
            this.$map.get(name).forEach(hook => hook(this.$node, ...args))
        }
        return this
    }
}
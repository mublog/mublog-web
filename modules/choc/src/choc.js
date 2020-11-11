// @ts-check
import render from "./helpers/render.js"
import update from "./helpers/update.js"
import set from "./helpers/set.js"
import appendChildren from "./helpers/children.js"
import Styles from "./helpers/styles.js"
import Signals from "./helpers/signals.js"

/**
 * @typedef ChocAttributes
 * @property {Partial<CSSStyleDeclaration>} [styles]
 */

/**
 * @template tag, props
 */
export default class Choc {
    /** @type {string} */
    $tagRef
    /** @type {props} */
    $propsRef
    /** @type {any[]} */
    $childrenRef

    /** @type {HTMLElementTagNameMap[tag & keyof HTMLElementTagNameMap] & { [key in keyof props]: any }} */
    $el
    /** @type {Map<keyof props, any>} */
    $states = new Map()
    $styles = new Styles(this)
    $signals = new Signals(this)
    /** @type {Map<any, Choc<any, any>>} */
    $children = new Map()

    /**
     * @param {Object} param
     * @param {tag & keyof HTMLElementTagNameMap} param.tag 
     * @param {props & ChocAttributes} param.props 
     * @param {(Choc<any, any> | string | Element)[]} param.children 
     */
    constructor({ tag, props, children }) {
        this.$tagRef = tag
        this.$propsRef = props
        this.$childrenRef = children
        render(this)
    }

    get nativeElement() {
        return this.$el
    }

    /**
     * @param {Partial<{ [key in keyof props]: any }>} stateValues 
     */
    update(stateValues) {
        update(this, stateValues)
        return this
    }

    /**
     * @param {any} key 
     */
    child(key) {
        return this.$children.get(key)
    }

    /**
     * @param {keyof props} state 
     */
    has(state) {
        return this.$states.has(state)
    }

    /**
     * @template state
     * @param {keyof props} state
     * @returns {props[state & keyof props]}
     */
    get(state) {
        return this.$states.get(state)
    }

    /**
     * @param {string & keyof props} state 
     * @param {any} value
     */
    set(state, value) {
        set(this, state, value)
        return this
    }

    /**
     * @param {Partial<CSSStyleDeclaration>} rules 
     */
    style(rules) {
        this.$styles.add(rules)
        return this
    }

    /**
     * @param {string} name 
     * @param {(node: this, ...args: any[]) => any} fn 
     */
    addSignal(name, fn) {
        this.$signals.add(name, fn)
        return this
    }

    /**
     * @param {string} name 
     * @param {(node: this, ...args: any[]) => any} fn 
     */
    removeSignal(name, fn) {
        this.$signals.del(name, fn)
        return this
    }

    /**
     * @param {string} name
     * @param {...any} args
     */
    signal(name, ...args) {
        this.$signals.run(name, args)
        return this
    }

    /**
     * @param {Element} target 
     */
    mount(target) {
        target.replaceWith(this.nativeElement)
        return this
    }

    unmount() {
        this.nativeElement.remove()
        return this
    }

    /**
     * @param {Element} target 
     */
    appendTo(target) {
        target.appendChild(this.nativeElement)
        return this
    }

    /**
     * @param {...(Element | Choc<any, any> | string)} children 
     */
    append(...children) {
        appendChildren(this, children)
        return this
    }

    /**
     * @param {string} name 
     * @param {(node: this, event: Event) => any} listener 
     */
    addEvent(name, listener) {
        if (!this.$signals.has(`@${name}`)) {
            this.nativeElement.addEventListener(name, (ev) => this.signal(`@${name}`, ev), false)
        }
        this.addSignal(`@${name}`, listener)
        return this
    }

    /**
     * @param {string} name 
     * @param {(node: this, event: Event) => any} listener 
     */
    removeEvent(name, listener) {
        this.removeSignal(`@${name}`, listener)
        return this
    }

    /**
     * @template mixin
     * @param {mixin} mixin
     * @returns {this & mixin}
     */
    mixin(mixin) {
        Object.assign(this, mixin)
        // @ts-ignore
        return this
    }

    /**
     * @template tag, props
     * @param {tag & keyof HTMLElementTagNameMap} tag 
     * @param {props & ChocAttributes} props 
     * @param  {(Choc<any, any> | string | Element)[]} children 
     */
    static create(tag, props = null, ...children) {
        return new Choc({ tag, props, children })
    }
}
// @ts-check
import state from "./state.js"

/**
 * @param {TemplateStringsArray} strings 
 * @param  {...any} values 
 */
export default function tagged(strings, ...values) {
    let tagState = state("")
    let fullStr = ""
    let states = []
    strings.forEach((string, i) => {
        if (values[i]) {
            if (values[i].isState === true) {
                fullStr += string + `{${i}}`
                values[i].subscribe(val => tagState.value = fullStr.replace(`{${i}}`, val))
                states.push(values[i])
            }
            else {
                fullStr += string + values[i]
            }
        }
        else {
            fullStr += string
        }
    })
    states.forEach(state => state.notify(state.value))
    return tagState
}
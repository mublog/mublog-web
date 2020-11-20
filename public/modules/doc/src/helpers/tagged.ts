import useState from "./state"

export default function tagged(strings: TemplateStringsArray, ...values: any[]) {
    let tagState = useState("")
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
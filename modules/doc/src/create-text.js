// @ts-check
/**
 * @param {TemplateStringsArray} strings 
 * @param  {...any} values 
 */
export default function createText(strings, ...values) {
    let template = []
    strings.forEach((string, i) => {
        if (values[i]) {
            template.push(string, values[i])
        }
        else {
            template.push(string)
        }
    })
    return template
}
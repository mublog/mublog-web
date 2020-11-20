export default function createText(strings: TemplateStringsArray, ...values: any[]) {
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
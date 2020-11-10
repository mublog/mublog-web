// @ts-check

export default class HttpClient {
    /**
     * @param {string} url
     * @param {string} method
     * @param {Object} [options]
     * @param {any} options.body
     * @param {"JSON" | "Text" | "Blob"} options.responseType
     */
    static async fetch(url, method, options) {
        let { body, responseType } = options
        if (body) {
            body = JSON.stringify(body)
        }
        else {
            body = undefined
        }
        try {
            let result = await fetch(url, { method, body })
            let resultContent
            switch (responseType) {
                case "JSON":
                    resultContent = await result.json()
                    break
                case "Text":
                    resultContent = await result.text()
                    break
                case "Blob":
                    resultContent = await result.blob()
            }
            return resultContent
        }
        catch (error) {
            console.error(error)
        }
    }
}
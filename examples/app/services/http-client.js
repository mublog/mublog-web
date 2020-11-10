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
            let results = {
                status: result.status,
                content: undefined
            }
            switch (responseType) {
                case "JSON":
                    results.content = await result.json()
                    break
                case "Text":
                    results.content = await result.text()
                    break
                case "Blob":
                    results.content = await result.blob()
            }
            return results
        }
        catch (error) {
            console.error(error)
        }
    }
}
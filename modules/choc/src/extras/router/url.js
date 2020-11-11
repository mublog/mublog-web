// @ts-check
export default () => location.pathname + location.search + location.hash

/**
 * @param {string} url 
 */
export function getURLParams(url) {
    let paramObj = {},
        params = new URLSearchParams(url)
    params.forEach((val, key) => {
        if (paramObj[key]) {
            if (Array.isArray(paramObj[key])) {
                paramObj[key] = [ ...paramObj[key], val ]
            }
            else {
                paramObj[key] = [ paramObj[key], val ]
            }
        }
        else {
            paramObj[key] = val
        }
    })
    return paramObj
}
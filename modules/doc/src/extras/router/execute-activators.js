// @ts-check

/**
 * @param {import("./types.js").RouteActivator[]} activatorArray 
 * @param {import("./types.js").URLParams} params
 */
export default async function executeActivators(activatorArray, params) {
    if (activatorArray) {
        try {
            for (let activator of activatorArray) {
                if (await activator(params) !== true) {
                    return false
                }
            }
        }
        catch (error) {
            console.error(error)
            return false
        }
    }
    return true
}
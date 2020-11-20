import type { RouteActivator, URLParams } from "./types"

export default async function executeActivators(
    activatorArray: RouteActivator[],
    params: URLParams
): Promise<boolean> {
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
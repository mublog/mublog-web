// @ts-check
import http from "./http-client.js"

export default class User {
    static currentUser

    /**
     * @param {Object} param
     * @param {string} param.alias
     * @param {string} param.password
     * @param {(error?: Error) => any} callback 
     */
    static async login({ alias, password }, callback) {
        try {
            let result = await http.fetch("/api/user", "PUT", {
                responseType: "JSON",
                body: { alias, password }
            })
            User.currentUser = result.content
            callback()
        }
        catch (error) {
            callback(error)
        }
    }

    /**
     * @param {() => any} callback 
     */
    static async logout(callback) {
        await http.fetch("/api/user", "DELETE", {
            responseType: "JSON",
            body: undefined
        })
        this.currentUser = undefined
        callback()
    }
}
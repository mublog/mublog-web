
// @ts-check

export let User = undefined

export const Users = [
    {
        id: 1,
        alias: "iljushka",
        name: "Ilja",
        profileImageUrl: "https://picsum.photos/200",
        password: "passwort"
    },
    {
        id: 2,
        alias: "tani",
        name: "Tani",
        profileImageUrl: "https://picsum.photos/300",
        password: "passwort"
    }
]

export const Posts = [
    {
        id: 1,
        datePosted: Date.now() - 500000,
        dateEdited: Date.now() - 200,
        user: 1,
        likeAmount: 10,
        textContent: "ahoooo"
    },
    {
        id: 2,
        datePosted: Date.now() - 15000,
        dateEdited: Date.now() - 3000,
        user: 2,
        likeAmount: 420,
        textContent: "awoooooo"
    }
]

export async function conn() {
    return new Promise(res => setTimeout(res, Math.round(Math.random()*500)))
}

export async function getPosts(predicate) {
    await conn()
    return Posts.filter(predicate).map(post => {
        /** @type {any} */
        let _post = { ...post }
        _post.user = Users.find(user => user.id === post.user)
        return _post
    })
}

export async function getUser({ alias }) {
    await conn()
    return Users.find(user => user.alias === alias)
}

export async function hasUser({ alias }) {
    await conn()
    if (!Users.find(user => user.alias === alias)) {
        return false
    }
    return true
}

export class UserService {
    static user = undefined

    static isUser() {
        return !!UserService.user
    }

    static async isAuthorized() {
        await conn()
        return UserService.isUser()
    }

    static async isUnauthorized() {
        await conn()
        return !UserService.isUser()
    }

    static async login(alias, password) {
        await conn()
        UserService.user = Users.find(user => user.alias === alias && user.password === password)
        return UserService.isUser()
    }

    static async logout() {
        await conn()
        UserService.user = undefined
    }
}
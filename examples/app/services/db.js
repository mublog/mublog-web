
// @ts-check

export let User = undefined

export const Users = [
    {
        id: 1,
        alias: "iljushka",
        name: "Ilja",
        image: "https://i.pinimg.com/originals/0f/04/47/0f04471f592c8afcf17c36b89796e63e.png",
        password: "passwort"
    },
    {
        id: 2,
        alias: "tani",
        name: "Tani",
        image: "https://coubsecure-s.akamaihd.net/get/b111/p/channel/cw_avatar/84e7c7c0cc0/787ebe9126b688618d3a0/profile_pic_big_1479058355_IMG_1221.JPG",
        password: "passwort"
    }
]

export const Posts = [
    {
        id: 1,
        dateTime: Date.now(),
        user: 1,
        textContent: "ahoooo"
    },
    {
        id: 2,
        dateTime: Date.now(),
        user: 2,
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
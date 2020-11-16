// @ts-check
import { useState, useMixin } from "../../../modules/doc/module.js"

export const Users = useMixin(useState([
    {
        alias: "iljushka",
        name: "Ilja",
        profileImageUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallup.net%2Fwp-content%2Fuploads%2F2018%2F09%2F26%2F190753-Yuru_Yuri-anime-Toshinou_Kyouko-blonde-anime_girls.jpg&f=1&nofb=1",
    },
    {
        alias: "max",
        name: "Maximilian",
        profileImageUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2Fzl57DfR_q4s%2Fmaxresdefault.jpg&f=1&nofb=1",
    },
    {
        alias: "anton",
        name: "Enton",
        profileImageUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2F736x%2F1c%2Fa2%2F04%2F1ca2048715d76a26ac0040264ce3e24c--charlotte-anime.jpg&f=1&nofb=1",
    }
]), {
    insert({ alias, name, password, profileImageUrl = "" }) {
        let user = Users.value.find(user => user.alias === alias)
        if (user) {
            return false
        }
        Users.update(users => users.push({ alias, name, password, profileImageUrl }))
        return true
    },

    findOne(alias) {
        return Users.value.find(user => user.alias === alias)
    },

    init() {

    }
})


export const User = useMixin(useState({
    loggedIn: false,
    id: undefined,
    alias: undefined,
    name: undefined,
    profileImageUrl: undefined
}), {
    register({ alias, name, password, profileImageUrl = "" }) {
        let success = Users.insert({ alias, name, password, profileImageUrl })
        if (success) {
            return true
        }
        else {
            return false
        }
    },

    login({ alias, password }) {
        let user = Users.findOne(alias)
        if (user) {
            User.update(state => {
                state.loggedIn = true
                state.alias = user.alias
                state.name = user.name
                state.profileImageUrl = user.profileImageUrl
            })
            return true
        }
        return false
    },

    isLoggedIn() {
        return !!User.value.loggedIn
    },

    getAlias() {
        return User.value.alias
    }
})

export const Comments = useMixin(useState([
    {
        id: 1,
        postId: 1,
        user: { ...Users.value.find(user => user.alias === "iljushka") },
        textContent: "Wo bin ich?",
        datePosted: Date.now(),
        dateEdited: Date.now()
    }
]), {
    insert(postId, textContent) {
        if (!User.isLoggedIn()) {
            return false
        }
        if (!Posts.has(postId)) {
            return false
        }
        let commentId = Date.now()
        Comments.update(comments => {
            comments.push({
                id: commentId,
                postId,
                user: Users.value.find(user => user.alias === User.value.alias),
                textContent,
                datePosted: Date.now(),
                dateEdited: Date.now()
            })
        })
        Posts.update(posts => {
            let post = posts.find(post => post.value.id === postId)
            post.value.comments.push(commentId)
            post.value.commentAmount = post.value.comments.length
        })
        return true
    },

    async find(predicate) {
        return Comments.value.filter(predicate)
    }
})

export const Posts = useMixin(useState([
    useState({
        id: 1,
        user: { ...Users.value.find(user => user.alias === "iljushka") },
        textContent: "Wo bin ich?",
        likeAmount: 0,
        likes: [],
        commentAmount: 0,
        comments: [],
        datePosted: Date.now() - 1000000,
        dateEdited: Date.now() - 1000000
    }),
    useState({
        id: 2,
        user: { ...Users.value.find(user => user.alias === "max") },
        textContent: "h3nt@1",
        likeAmount: 0,
        likes: [],
        commentAmount: 0,
        comments: [],
        datePosted: Date.now() - 200000,
        dateEdited: Date.now() - 200000
    }),
    useState({
        id: 3,
        user: { ...Users.value.find(user => user.alias === "anton") },
        textContent: "hallo :D",
        likeAmount: 0,
        likes: [],
        commentAmount: 0,
        comments: [],
        datePosted: Date.now(),
        dateEdited: Date.now()
    }),
]), {
    async insert(textContent) {
        if (!User.isLoggedIn()) {
            return false
        }
        Posts.update(posts => {
            posts.push(useState({
                id: Date.now(),
                user: Users.value.find(user => user.alias === User.value.alias),
                textContent,
                likeAmount: 0,
                likes: [],
                commentAmount: 0,
                comments: [],
                datePosted: Date.now(),
                dateEdited: Date.now()
            }))
        })
        return true
    },

    find(predicate) {
        return Posts.value.filter(predicate)
    },

    findOne(predicate) {
        return Posts.value.find(predicate)
    },

    has(postId) {
        return Posts.value.findIndex(post => post.value.id === postId) >= 0
    }
})

User.subscribe(state => {
    if (state.loggedIn === false) {
        state.alias = undefined
        state.id = undefined
        state.name = undefined
    }
})
// @ts-check
import Doc, { useState } from "../../../modules/doc/module.js"

export const Users = useState([
    {
        id: 1,
        alias: "iljushka",
        name: "Ilja",
        profileImageUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallup.net%2Fwp-content%2Fuploads%2F2018%2F09%2F26%2F190753-Yuru_Yuri-anime-Toshinou_Kyouko-blonde-anime_girls.jpg&f=1&nofb=1",
        _password: "passwort"
    },
    {
        id: 2,
        alias: "max",
        name: "Maximilian",
        profileImageUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2Fzl57DfR_q4s%2Fmaxresdefault.jpg&f=1&nofb=1",
        _password: "passwort"
    },
    {
        id: 3,
        alias: "anton",
        name: "Enton",
        profileImageUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2F736x%2F1c%2Fa2%2F04%2F1ca2048715d76a26ac0040264ce3e24c--charlotte-anime.jpg&f=1&nofb=1",
        _password: "passwort"
    }
])

export const Posts = useState([
    {
        id: 1,
        user: { ...Users.value.find(user => user.id === 1) },
        textContent: "Penis",
        likeAmount: 10,
        datePosted: Date.now() - 1000000,
        dateEdited: Date.now() - 1000000
    },
    {
        id: 2,
        user: { ...Users.value.find(user => user.id === 1) },
        textContent: "Meep meep :3",
        likeAmount: 420,
        datePosted: Date.now() - 500000,
        dateEdited: Date.now() - 500000
    },
    {
        id: 3,
        user: { ...Users.value.find(user => user.id === 2) },
        textContent: "h3nt@1",
        likeAmount: 0,
        datePosted: Date.now() - 200000,
        dateEdited: Date.now() - 200000
    },
    {
        id: 4,
        user: { ...Users.value.find(user => user.id === 3) },
        textContent: "hallo",
        likeAmount: 999999999,
        datePosted: Date.now(),
        dateEdited: Date.now()
    },
])

export const User = useState({
    loggedIn: false,
    id: undefined,
    alias: undefined,
    name: undefined
})

export const login = ({ alias, password }) => {
    let user = Users.value.find(user => 
        user.alias === alias &&
        user._password === password
    )
    if (user) {
        User.update(state => {
            state.id = user.id
            state.alias = user.alias
            state.loggedIn = true
            state.name = user.name
        })
    }
}
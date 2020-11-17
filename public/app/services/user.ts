import { useState, useMixin } from "../../../modules/doc/module"
import type { Types } from "../../../modules/doc/module"
import type { User as UserType } from "../definitions/user"
import mockUsers from "./mock_users"

const UsersState: Types.State<UserType[]> = useState(mockUsers)

export const Users = useMixin(UsersState, {
    insert(insertedUser: UserType) {
        let find = Users.value.find(user => user.alias === insertedUser.alias)
        if (find) {
            return false
        }
        Users.update(users => users.push(insertedUser))
        return true
    },
    findOne(alias: string) {
        return Users.value.find(user => user.alias === alias)
    }
})

const UserState = useState({
    loggedIn: false,
    alias: undefined,
    name: undefined,
    profileImageUrl: undefined
})

export const User = useMixin(UserState, {
    register(registerUser: UserType) {
        let success = Users.insert(registerUser)
        if (success) {
            return true
        }
        else {
            return false
        }
    },
    login({ alias }: { alias: string }) {
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

User.subscribe(state => {
    if (state.loggedIn === false) {
        state.alias = undefined
        state.name = undefined
        state.profileImageUrl = undefined
    }
})
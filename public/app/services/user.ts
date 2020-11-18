import { useState, useMixin } from "../../../modules/doc/module"
import type { User as UserType, CurrentUser as CurrentUserType } from "../definitions/user"
import mockUsers from "./mock_users"

export const Users = useMixin(useState(mockUsers), {
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
    },
    find(predicate: (user: UserType) => any): UserType {
        return Users.value.find(predicate)
    }
})

export const UserService = useMixin(useState<CurrentUserType>({} as CurrentUserType), {
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
            UserService.update(state => {
                state.loggedIn = true
                state.alias = user.alias
                state.name = user.name
                state.profileImageUrl = user.profileImageUrl
            })
            return true
        }
        return false
    },
    logout(callback?: () => any) {
        UserService.update(state => state.loggedIn = false)
        if (callback) {
            callback()
        }
    },
    isLoggedIn() {
        return !!UserService.value.loggedIn
    },
    getAlias() {
        return UserService.value.alias
    },
    ping() {
        // API
    }
})

UserService.subscribe(state => {
    if (state.loggedIn === false) {
        state.alias = undefined
        state.name = undefined
        state.profileImageUrl = undefined
    }
})
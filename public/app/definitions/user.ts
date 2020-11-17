export interface User {
    alias: string
    name: string
    profileImageUrl: string
}

export type CurrentUser = User &  {
    loggedIn: boolean
}
// @ts-check
let Posts = [], Users

(async () => {
    Posts = await (await fetch("http://localhost:3000/posts")).json()
    Users = Posts.map(post => {
        return {
            ...post.user,
            password: "password"
        }
    })
})()

export {
    Posts,
    Users
}
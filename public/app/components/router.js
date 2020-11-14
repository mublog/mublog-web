// @ts-check
import Doc from "../../../modules/doc/module.js"
import i18n from "../../lang/de_DE.js"
import Home from "../views/home.js"
import User from "../views/user.js"
import Login from "../views/login.js"
import Register from "../views/register.js"
import RouteNotFound from "../views/route-not-found.js"
import * as db from "../services/fakedb.js"

const Router = Doc.createRouter(Doc.createNode("div", { id: "router", className: "loading" }), [
    {  path: "",  title: i18n.home, component: Home },
    { 
        path: "login/?*", 
        title: i18n.login, 
        component: Login,
        activates: [ () => db.User.value.loggedIn === false ]
    },
    { 
        path: "register/?*", 
        title: i18n.register, 
        component: Register,
        activates: [ () => db.User.value.loggedIn === false ]
    },
    {
        path: "user/:alias", 
        title: ({ alias }) => `.${alias}//`, 
        component: User,
        activates: [ 
            () => db.User.value.loggedIn === true,
            ({ alias }) => !!db.Users.value.find(user => user.alias === alias),
            () => new Promise(resolve => setTimeout(() => resolve(true), 1000))
        ]
    },
    { path: "**", title: i18n.error, component: RouteNotFound }
])

Router.onLoad(() => Router.classList.add("loading"))
Router.onLoadEnd(() => Router.classList.remove("loading"))

export default Router
import Doc from "../../../modules/doc/module"
import i18n from "../../lang/de_DE.json"
import Presentation from "../views/presentation"
import Home from "../views/home"
import User from "../views/user"
import UserPost from "../views/user-post"
import Login from "../views/login"
import Register from "../views/register"
import RouteNotFound from "../views/route-not-found"
import { UserService, Users } from "../services/user"

const Router = Doc.createRouter(Doc.createNode("div", { id: "router", className: "loading" }), [
    {  path: "",  title: i18n.home, component: Home },
    {  path: "presentation/?*",  title: i18n.presentation, component: Presentation },
    { 
        path: "login/?*", 
        title: i18n.login, 
        component: Login,
        activates: [ () => !UserService.isLoggedIn() ]
    },
    { 
        path: "register/?*", 
        title: i18n.register, 
        component: Register,
        activates: [ () => !UserService.isLoggedIn() ]
    },
    {
        path: "user/:alias", 
        title: ({ alias }) => `.${alias}//`, 
        component: User,
        activates: [ 
            ({ alias }) => !!Users.value.find(user => user.alias === alias),
            () => new Promise(resolve => setTimeout(() => resolve(true), 500))
        ],
        children: [
            {
                path: "post/:id",
                title: ({ alias, id }) => `.${alias}//post/${id}`,
                component: UserPost
            }
        ]
    },
    { path: "**", title: i18n.error, component: RouteNotFound }
])

Router.onLoad(() => Router.classList.add("loading"))
Router.onLoadEnd(() => Router.classList.remove("loading"))

export default Router
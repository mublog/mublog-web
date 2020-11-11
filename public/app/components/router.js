// @ts-check
import Extras from "../../../modules/choc/extras.js"
import Choc from "../../../modules/choc/module.js"

import i18n from "../lang/de_DE.js"
import { UserService, hasUser } from "../services/db.js"

import Home from "../views/home.js"
import User from "../views/user.js"
import Login from "../views/login.js"
import Register from "../views/register.js"
import RouteNotFound from "../views/route-not-found.js"

const Router = Extras.chocRouter(Choc.create("div", { id: "router", className: "loading" }), [
    { 
        path: "", 
        title: i18n.home, 
        component: Home
    },
    { 
        path: "login/?*", 
        title: i18n.login, 
        component: Login,
        activates: [ UserService.isUnauthorized ]
    },
    { 
        path: "register/?*", 
        title: i18n.register, 
        component: Register,
        activates: [ UserService.isUnauthorized ]
    },
    {
        path: "user/:alias", 
        title: ({ alias }) => `.${alias}//`, 
        component: User,
        activates: [ hasUser ]
    },
    { 
        path: "**", 
        title: i18n.error, 
        component: RouteNotFound
    }
])

Router.onLoad(() => Router.nativeElement.classList.add("loading"))
Router.onLoadEnd(() => Router.nativeElement.classList.remove("loading"))

export default Router
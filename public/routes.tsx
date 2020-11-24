import UserService from "./app/services/user.service"
import PostService from "./app/services/post.service"
import i18n from "./lang/de_DE.json"

import HomeView from "./app/views/home.view"
import PresentationView from "./app/views/presentation.view"
import LoginView from "./app/views/login.view"
import UserView from "./app/views/user.view"
import UserPostView from "./app/views/user-post.view"
import RegisterView from "./app/views/register.view"
import RouteNotFoundView from "./app/views/route-not-found.view"

const Routes: RouteConstructor[] = [
  {
    path: "",
    title: i18n.home,
    component: HomeView
  },
  {
    path: "presentation/?*",
    title: i18n.presentation,
    component: PresentationView
  },
  {
    path: "login/?*",
    title: i18n.login,
    component: LoginView,
    activates: [UserService.isGuest.get]
  },
  {
    path: "register/?*",
    title: i18n.register,
    component: RegisterView,
    activates: [UserService.isGuest.get]
  },
  {
    path: "user/:alias",
    title: ({ alias }) => `\$\{${alias}\}`,
    component: UserView,
    activates: [
      ({ alias }) => UserService.hasUser(alias)
    ],
    children: [
      {
        path: "post/:id",
        title: ({ alias, id }) => `\$\{${alias + ".post." + id}\}`,
        component: UserPostView,
        activates: [
          ({ alias, id }) => PostService.hasPost(parseInt(id))
        ]
      }
    ]
  },
  {
    path: "**",
    title: i18n.error,
    component: RouteNotFoundView
  }
]

export default Routes
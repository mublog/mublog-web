import * as UserService from "./app/services/user.service"
import * as PostService from "./app/services/post.service"
import i18n from "./lang/de_DE.json"

import HomeView from "./app/views/home.view"
import SettingsView from "./app/views/settings.view"
import LoginView from "./app/views/login.view"
import UserView from "./app/views/user.view"
import UserPostView from "./app/views/user-post.view"
import RegisterView from "./app/views/register.view"
import RouteNotFoundView from "./app/views/route-not-found.view"

const Routes: RouteConstructor[] = [
  {
    path: "",
    title: `\$\{${"page." + i18n.home}\}`,
    component: HomeView
  },
  {
    path: "login/?*",
    title: `\$\{${"page." + i18n.login}\}`,
    component: LoginView,
    activates: [UserService.isGuest.value]
  },
  {
    path: "register/?*",
    title: `\$\{${"page." + i18n.register}\}`,
    component: RegisterView,
    activates: [UserService.isGuest.value]
  },
  {
    path: "settings/?*",
    title: `\$\{${"page." + i18n.settings}\}`,
    component: SettingsView,
    activates: [UserService.isUser.value]
  },
  {
    path: "user/:alias",
    title: ({ alias }) => `\$\{${"user." + alias}\}`,
    component: UserView,
    activates: [
      ({ alias }) => UserService.hasUser(alias)
    ],
    children: [
      {
        path: "post/:id",
        title: ({ alias, id }) => `\$\{${"user." + alias + ".post." + id}\}`,
        component: UserPostView,
        activates: [
          ({ alias, id }) => PostService.hasPost(parseInt(id))
        ]
      }
    ]
  },
  {
    path: "**",
    title: `\$\{${"page." + i18n.error}\}`,
    component: RouteNotFoundView
  }
]

export default Routes
// @ts-check
import Doc, { useEvent, useEvents, useState, useStyles } from "../../../modules/doc/module.js"
import Box, { Arrow, Header, Footer } from "../components/box.js"
import Flex from "../components/flex.js"
import Time from "../components/time.js"
import Menu from "../components/menu.js"
import { Icon } from "../components/generic.js"
import * as db from "../services/fakedb.js"

export default function Post({ 
    id,
    user: { alias, name, profileImageUrl },
    textContent,
    likeAmount,
    datePosted,
    dateEdited
}) {
    const PostRef = db.Posts.value.find(post => post.id === id)
    const HeartsAmount = useState(likeAmount)
    const HeartNames = useState(PostRef.likes)

    const ViewHeartsIcon = Icon({ name: "heart-grey", className: "post-like" })
    const View = Doc.createNode("div", { id: `post-${id}`, className: "post" },
        Flex({ gap: "8px" },
            Doc.createNode("a", { href: `/user/${alias}`, className: "user-image-wrap" },
                Doc.createNode("div", { className: "user-image" }),
                Doc.createNode("div", { className: "user-image-frame" })
            ),
            Box({ className: "post-content" },
                Arrow("top-left"),
                Header({ },
                    Doc.createNode("a", { href: `/user/${alias}`, className: "user-link" },
                        Flex({ gap: "8px", className: "user" },
                            Doc.createNode("span", { className: "user-name" }, name),
                            Doc.createNode("span", { className: "user-alias" }, alias)
                        )
                    ),
                    Time({ dateTime: datePosted, className: "datetime" }),
                    Icon({ name: "calendar" })  
                ),
                Doc.createNode("div", { className: "user-content" },
                    Box({ className: "text-content", innerHTML: textContent })
                ),
                Footer({ },
                    Flex({ gap: "8px" },
                        Flex({ gap: "8px", alignItems: "center", className: "heart-action" },
                            ViewHeartsIcon,
                            Doc.createNode("span", { innerText: HeartsAmount })
                        ),
                        Icon({ name: "menu-meatballs", className: "post-menu" })
                    )
                )
            )
        )
    )

    const ViewUserImageRef = Doc.query(View, "div", ".user-image")
    const ViewHeartRef = Doc.query(View, "div", ".heart-action")
    const ViewMenuTriggerRef = Doc.query(View, "i", ".post-menu")

    const PostMenu = Menu({ },
        Doc.createNode("a", { href: "/" }, "home"),
        Doc.createNode("a", { href: "/login" }, "login"),
        Doc.createNode("a", { href: "/register" },  "register"),
        Doc.createNode("div", {},
            "Submenu",
            Menu({ },
                Doc.createNode("a", { href: "/" }, "home"),
                Doc.createNode("a", { href: "/login" }, "login"),
                Doc.createNode("a", { href: "/register" },  "register"),
            )
        )
    )
    PostMenu.hide()
    ViewMenuTriggerRef.appendChild(PostMenu)

    useEvent(ViewMenuTriggerRef, "click", ({ clientX, clientY }) => {
        PostMenu.toggle()
        PostMenu.set("fixed", `${clientY}px`, `${clientX}px`)
    })
    
    useEvent(ViewHeartRef, "click", event => {
        if (!db.User.value.loggedIn) {
            return
        }
        HeartNames.update(names => {
            let index = names.indexOf(db.User.value.alias)
            if (index === -1) {
                names.push(db.User.value.alias)
            }
            else if (index >= 0) {
                names.splice(index, 1)
            }
        })
    })

    db.User.subscribe(state => {
        if (state.loggedIn) {
            ViewHeartsIcon.classList.add("clickable")
        }
        else {
            ViewHeartsIcon.classList.remove("clickable")
        }
    })

    HeartNames.subscribe(names => {
        HeartsAmount.value = names.length
        if (db.User.value.loggedIn) {
            ViewHeartsIcon.iconName = names.includes(db.User.value.alias) ? "heart-red" : "heart-grey"
        }
    })

    useStyles(ViewUserImageRef, { 
        backgroundImage: `url("${profileImageUrl}")`
    })

    return View
}
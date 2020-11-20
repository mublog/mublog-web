import Doc, { useState, useEvent, useMixin } from "../../modules/doc/module"
import Box, { Arrow, Header, Footer } from "./box.component"
import Flex from "./flex.component"
import Time from "./time.component"
import UserImage from "./user-image.component"
import { Icon, IconElement } from "./icon.component"
import { UserService } from "../services/user.service"
import PostService from "../services/post.service"
import type { Post as PostType } from "../definitions/post"
import type { State } from "../../modules/doc/module"
import translateMD from "../helpers/mark-down"

export type PostElement = State<HTMLDivElement & {
    States: {
        likeAmount: State<number>
        likes: State<string[]>
    }
}>

export default function Post({
    id,
    user: { alias, name, profileImageUrl },
    textContent,
    datePosted, dateEdited,
    comments, commentAmount,
    likes, likeAmount
}: PostType): PostElement {
    const View = Doc.createElement("div", { className: "post" },
        Flex({ gap: "8px" },
            Doc.createElement("a", { className: "user-link", href: `/user/${alias}` }, 
                UserImage({ className: "post-avatar", userImage: profileImageUrl })
            ),
            Box({ className: "post-content" },
                Arrow({ type: "top-left" }),
                Header({ },
                    Doc.createElement("a", { className: "user-link", href: `/user/${alias}` },
                        Flex({ gap: "8px", className: "user" },
                            Doc.createElement("span", { className: "user-name" }, name),
                            Doc.createElement("span", { className: "user-alias" }, alias)
                        )
                    ),
                    Time({ datetime: datePosted, className: "datetime" }),
                    Icon({ name: "calendar" })  
                ),
                Doc.createElement("div", { className: "user-content" },
                    Box({ className: "text-content mark-down", innerHTML: translateMD(textContent) })
                ),
                Footer({ },
                    Flex({ gap: "8px" },
                        Flex({ gap: "8px", alignItems: "center", className: "heart-action" },
                            Icon({ 
                                name: "heart-grey", 
                                className: UserService.isLoggedIn() ? "post-like clickable cursor-action" : "post-like cursor-disabled"
                            }),
                            Doc.createElement("span", { innerText: likeAmount })
                        ),
                        Doc.createElement("a", { href: `/user/${alias}/post/${id}`, className: "comment-action" },
                            Flex({ gap: "8px", alignItems: "center" },
                                Icon({ name: "comment-bubbles-grey", className: "post-comment" }),
                                Doc.createElement("span", { innerText: commentAmount })
                            )
                        ),
                        Icon({ name: "menu-meatballs", className: "post-menu" })
                    )
                )
            )
        )
    )

    const ViewHeartsIconRef = Doc.query<IconElement>(View, ".post-like")

    likes.subscribe(list =>  {
        ViewHeartsIconRef.iconName = list.includes(UserService.getAlias()) ? "heart-red" : "heart-grey"
    })

    useEvent(Doc.query<HTMLDivElement>(View, ".heart-action"), "click", () => PostService.like(id))

    return useState(useMixin(View, {
        States: {
            likeAmount,
            likes
        }
    }))
}
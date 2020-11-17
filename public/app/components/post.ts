import Doc, { useMixin } from "../../../modules/doc/module"
import Box, { Arrow, Header, Footer } from "./box"
import Flex from "./flex"
import Time from "./time"
import UserImage from "./user-image"
import { Icon, IconElement } from "./generic"
import type { User as UserType } from "../definitions/user"
import translateMD from "../helpers/mark-down"

export interface PostConstructor {
    id: number
    user: UserType
    textContent: string
    likeAmount: number
    likes: string[]
    commentAmount: number
    comments: number[]
    datePosted: number
    dateEdited: number
}

export interface PostElement extends HTMLDivElement {
    updateHearts(): void
    updateComments(): void
}

export default function Post(post: PostConstructor): PostElement {
    let { id, user: { alias, name, profileImageUrl }, textContent, datePosted, likeAmount, commentAmount } = post

    const View = Doc.createNode("div", { className: "post" },
        Flex({ gap: "8px" },
            Doc.createNode("a", { className: "user-link", href: `/user/${alias}` }, 
                UserImage({ className: "post-avatar", userImage: profileImageUrl })
            ),
            Box({ className: "post-content" },
                Arrow({ type: "top-left" }),
                Header({ },
                    Doc.createNode("a", { className: "user-link", href: `/user/${alias}` },
                        Flex({ gap: "8px", className: "user" },
                            Doc.createNode("span", { className: "user-name" }, name),
                            Doc.createNode("span", { className: "user-alias" }, alias)
                        )
                    ),
                    Time({ datetime: datePosted, className: "datetime" }),
                    Icon({ name: "calendar" })  
                ),
                Doc.createNode("div", { className: "user-content" },
                    Box({ className: "text-content mark-down", innerHTML: translateMD(textContent) })
                ),
                Footer({ },
                    Flex({ gap: "8px" },
                        Flex({ gap: "8px", alignItems: "center", className: "heart-action" },
                            Icon({ name: "heart-grey", className: "post-like" }),
                            Doc.createNode("span", { innerText: String(likeAmount) })
                        ),
                        Doc.createNode("a", { href: `/user/${alias}/post/${id}`, className: "comment-action" },
                            Flex({ gap: "8px", alignItems: "center" },
                                Icon({ name: "comment-bubbles-grey", className: "post-comment" }),
                                Doc.createNode("span", { innerText: String(commentAmount) })
                            ),
                        ),
                        Icon({ name: "menu-meatballs", className: "post-menu" })
                    )
                )
            )
        )
    )

    const ViewHeartRef = Doc.query<HTMLDivElement>(View, ".heart-action")
    const ViewHeartsIconRef = Doc.query<IconElement>(View, ".post-like")

    //useEvent(ViewHeartRef, "click", PostRef.$like)

    /* let heartSubscription = (state: string[]) => {
        if (UserService.isLoggedIn()) {
            ViewHeartsIconRef.classList.remove("cursor-disabled")
            ViewHeartsIconRef.classList.add("clickable", "cursor-action")
            if (PostRef.$likes.value.includes(UserService.getAlias())) {
                ViewHeartsIconRef.iconName = "heart-red"
            }
            else {
                ViewHeartsIconRef.iconName = "heart-grey"
            }
        }
        else {
            ViewHeartsIconRef.classList.remove("clickable", "cursor-action")
            ViewHeartsIconRef.classList.add("cursor-disabled")
            ViewHeartsIconRef.iconName = "heart-grey"
        }
    } */

    return useMixin(View, {
        updateHearts() {
            
        },
        updateComments() {
            
        }
    })
}
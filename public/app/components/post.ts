import Doc, { useMixin, useEvent, useState } from "../../../modules/doc/module"
import Box, { Arrow, Header, Footer } from "./box"
import Flex from "./flex"
import Time from "./time"
import UserImage from "./user-image"
import { Icon, IconElement } from "./generic"
import type { User as UserType } from "../definitions/user"
import type { Post as PostType } from "../definitions/post"
import { UserService } from "../services/user"
import { CurrentPosts as PostService }  from "../services/posts"
import type { Types } from "../../../modules/doc/module"
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

export type PostElement = HTMLDivElement

export default function Post(post: PostConstructor): PostElement {
    let { id, user: { alias, name, profileImageUrl }, textContent, datePosted } = post

    if (!PostService.has(id)) {
        // @ts-expect-error
        return document.createComment("post not found")
    }

    const PostRef = PostModel(PostService.findOne($ => $.value.id === id))

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
                            Doc.createNode("span", { innerText: PostRef.$likeAmount })
                        ),
                        Flex({ gap: "8px", alignItems: "center", className: "comment-action" },
                            Icon({ name: "comment-bubbles-grey", className: "post-comment" }),
                            Doc.createNode("span", { innerText: PostRef.$commentAmount })
                        ),
                        Icon({ name: "menu-meatballs", className: "post-menu" })
                    )
                )
            )
        )
    )

    const ViewHeartRef = Doc.query<HTMLDivElement>(View, ".heart-action")
    const ViewHeartsIconRef = Doc.query<IconElement>(View, ".post-like")

    useEvent(ViewHeartRef, "click", PostRef.$like)

    let heartSubscription = (state: string[]) => {
        if (UserService.isLoggedIn()) {
            ViewHeartsIconRef.classList.remove("cursor-disabled")
            ViewHeartsIconRef.classList.add("clickable", "cursor-action")
        }
        else {
            ViewHeartsIconRef.classList.add("cursor-disabled")
            ViewHeartsIconRef.classList.remove("clickable")
        }

        if (PostRef.$likes.value.includes(UserService.getAlias())) {
            ViewHeartsIconRef.iconName = "heart-red"
        }
        else {
            ViewHeartsIconRef.iconName = "heart-grey"
        }
    }

    PostRef.$likes.subscribe(heartSubscription)

    return View
}

function PostModel(postReference: Types.State<PostType>) {
    const likeAmount = useState(postReference.value.likeAmount)
    const commentAmount = useState(postReference.value.commentAmount)
    const likes = useState(postReference.value.likes)
    const comments = useState(postReference.value.comments)

    likes.subscribe(names => likeAmount.value = names.length)
    comments.subscribe(ids => commentAmount.value = ids.length)

    return useMixin(postReference, {
        $like() {
            if (!UserService.isLoggedIn()) {
                return
            }
            postReference.update(post => {
                let index = likes.value.indexOf(UserService.getAlias())
                if (index === -1) {
                    likes.update(likes => likes.push(UserService.getAlias()))
                }
                else {
                    likes.update(likes => likes.splice(index, 1))
                }
            })
        },
        get $likes() {
            return likes
        },
        get $likeAmount() {
            return likeAmount
        },
        get $comments() {
            return comments
        },
        get $commentAmount() {
            return commentAmount
        }
    })
}
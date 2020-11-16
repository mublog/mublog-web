// @ts-check
import Doc, { useMixin, useEvent, useState, useStyles } from "../../../modules/doc/module.js"
import Box, { Arrow, Header, Footer } from "../components/box.js"
import Flex from "../components/flex.js"
import Time from "../components/time.js"
import UserImage from "../components/user-image.js"
import { Icon } from "../components/generic.js"
import * as db from "../services/fakedb.js"

/**
 * @typedef PostConstructor
 * @property {number} id
 * @property {Object} user
 * @property {string} user.alias
 * @property {string} user.name
 * @property {string} user.profileImageUrl
 * @property {string} textContent
 * @property {number} likeAmount
 * @property {string[]} likes
 * @property {number} commentAmount
 * @property {number} datePosted
 * @property {number} dateEdited
 */

/**
 * @param {PostConstructor} post 
 */
export default function Post(post) {
    let { id, user: { alias, name, profileImageUrl }, textContent, datePosted } = post

    const PostRef = PostModel(db.Posts.findOne($ => $.value.id === id))

    const ViewUserImage = UserImage()
    const View = Doc.createNode("div", { className: "post" },
        Flex({ gap: "8px" },
            Doc.createNode("a", { className: "user-link", href: `/user/${alias}` }, ViewUserImage),
            Box({ className: "post-content" },
                Arrow("top-left"),
                Header({ },
                    Doc.createNode("a", { className: "user-link", href: `/user/${alias}` },
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

    const ViewHeartRef = Doc.query(View, "div", ".heart-action")
    const ViewHeartsIconRef = Doc.query(View, "i", ".post-like")

    useEvent(ViewHeartRef, "click", PostRef.$like)

    let heartSubscription = state => {
        if (db.User.isLoggedIn()) {
            ViewHeartsIconRef.classList.remove("cursor-disabled")
            ViewHeartsIconRef.classList.add("clickable", "cursor-action")
        }
        else {
            ViewHeartsIconRef.classList.add("cursor-disabled")
            ViewHeartsIconRef.classList.remove("clickable")
        }

        if (PostRef.$likes.value.includes(db.User.getAlias())) {
            ViewHeartsIconRef.classList.replace("icon-heart-grey", "icon-heart-red")
        }
        else {
            ViewHeartsIconRef.classList.replace("icon-heart-red", "icon-heart-grey")
        }
    }

    PostRef.$likes.unsubscribe(heartSubscription)
    PostRef.$likes.subscribe(heartSubscription)

    ViewUserImage.userImage = profileImageUrl

    return View
}

/**
 * @template t
 * @param {import("../../../modules/doc/src/helpers/state.js").State<t>} postReference 
 */
function PostModel(postReference) {
    const likeAmount = useState(postReference.value["likeAmount"])
    const commentAmount = useState(postReference.value["commentAmount"])
    const likes = useState(postReference.value["likes"])
    const comments = useState(postReference.value["comments"])

    likes.subscribe(names => likeAmount.value = names.length)
    comments.subscribe(ids => commentAmount.value = ids.length)

    return useMixin(postReference, {
        $like() {
            if (!db.User.isLoggedIn()) {
                return
            }
            postReference.update(post => {
                let index = likes.value.indexOf(db.User.getAlias())
                if (index === -1) {
                    likes.update(likes => likes.push(db.User.getAlias()))
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
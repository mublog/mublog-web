// @ts-check
import Doc, { useState, useStyles } from "../../../modules/doc/module.js"
import Box, { Arrow, Header, Footer } from "../components/box.js"
import Flex from "../components/flex.js"
import Time from "../components/time.js"
import { Route, Icon } from "../components/generic.js"
import translateMarkDown from "../helpers/mark-down.js"

export default function Post({ 
    id,
    user: { alias, name, profileImageUrl },
    textContent,
    likeAmount,
    datePosted,
    dateEdited
}) {
    const ViewUserImage = Doc.createNode("div", { className: "user-image" })
    const View = Doc.createNode("div", { id: `post-${id}`, className: "post" },
        Flex({ gap: "8px" },
            Route({ href: `/user/${alias}`, className: "user-image-wrap" },
                ViewUserImage,
                Doc.createNode("div", { className: "user-image-frame" })
            ),
            Box({ className: "post-content" },
                Arrow("top-left"),
                Header({ },
                    Route({ href: `/user/${alias}`, className: "user-link" },
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
                        Flex({ gap: "8px", alignItems: "center" },
                            Icon({ name: "heart-grey", className: "post-like" }),
                            Doc.createNode("span", { innerText: likeAmount })
                        ),
                        Icon({ name: "menu-meatballs", className: "post-menu" })
                    )
                )
            )
        )
    )

    useStyles(ViewUserImage, { backgroundImage: `url("${profileImageUrl}")` })

    return View
}
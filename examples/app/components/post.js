// @ts-check
import Box, { Seperator, Title, Arrow } from "../components/box.js"
import Flex from "../components/flex.js"
import Time from "../components/time.js"
import { Div, Span, Route } from "../components/generic.js"

export default function Post({ 
    id,
    user: {
        alias,
        name,
        profileImageUrl
    },
    textContent,
    likeAmount,
    datePosted,
    dateEdited
}) {
    let component = Div({ id: `post-${id}`, className: "post" },
        Flex({ gap: "8px" },
            Route({ href: `/user/${alias}`, className: "user-image-wrap" },
                Div({ className: "user-image" }).style({ backgroundImage: `url("${profileImageUrl}")`}),
                Div({ className: "user-image-frame" })
            ),
            Box({ className: "post-content" },
                Arrow("top-left"),
                Title({ },
                    Flex({ gap: "8px" },
                        Route({ href: `/user/${alias}`, className: "user-link" },
                            Flex({ gap: "8px", className: "user" },
                                Span({ className: "user-name" }, name),
                                Span({ className: "user-alias" }, alias)
                            )
                        ),
                        Time({ dateTime: datePosted, title: dateEdited, className: "datetime" })
                    )
                ),
                Seperator(),
                Div({ className: "user-content" },
                    Box({ className: "text-content" }, textContent)
                ),
                Seperator(),
                Flex({ gap: "8px" },
                    Flex({ gap: "8px", alignItems: "center" },
                        Span({}, String(likeAmount)),
                        Span({}, "Like"),
                    ),
                    Span({ className: "post-menu" }, "Menu")
                )   
            )
        )
    )
    return component
}